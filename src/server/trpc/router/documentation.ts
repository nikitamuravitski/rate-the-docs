import { prisma } from './../../db/client';
import { protectedProcedure } from '../trpc';
import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { docVersion, language } from '../../../types/zodTypes';
import docVersionHelpers from '../../../utils/docVersionHelpers';


export const documentationRouter = router({
  createProposal: publicProcedure
    .input(z.object({
      name: z
        .string()
        .min(2, "Name is too short (minimum 2)")
        .trim(),
      description: z
        .string()
        .min(10, "Description is too short (minimum 10)")
        .trim(),
      linkToDocs: z
        .string()
        .url()
        .trim(),
      linkToRepo: z
        .string()
        .url()
        .trim(),
      packageName: z
        .string()
        .min(2, "Package name is too short (minimum 2)")
        .trim(),
      docVersion,
      language
    }))
    .mutation(async ({ input }) => {
      const dublicate = await prisma.documentation.findFirst({
        where: {
          AND: [
            {
              docVersion: docVersionHelpers.fold(input.docVersion)
            },
            {
              packageName: input.packageName
            },
            {
              name: input.name
            },
            {
              language: input.language
            }
          ]
        }
      })

      if (dublicate) throw new Error('There is a dublicate')
      return prisma.documentation.create({
        data: {
          ...input,
          docVersion: docVersionHelpers.fold(input.docVersion)
        }
      })
    }),

  voteForProposal: protectedProcedure
    .input(z.object({
      value: z.union([z.literal(-1), z.literal(1)]),
      documentationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const isUserAlreadyVoted = await prisma.vote.findFirst({
        where: {
          userId: ctx.session.user.id,
          documentationId: input.documentationId
        }
      })
      if (isUserAlreadyVoted) throw new Error('You already voted for this')
      return prisma.vote.create({
        data: {
          value: input.value,
          userId: ctx.session.user.id,
          documentationId: input.documentationId,
        }
      })
    }),

  getPendingProposals: publicProcedure
    .input(z.object({
      pageIndex: z.number(),
      pageSize: z.number()
    }))
    .query(async ({ input }) => {
      const count = await prisma.documentation.count({
        where: {
          status: 'voting'
        }
      })
      const totalPages = Math.ceil(count / input.pageSize)
      const pendingProposals = await prisma.documentation.findMany({
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
        where: {
          status: 'voting'
        },
        include: {
          votes: true
        }
      })
      return {
        totalPages, pendingProposals
      }
    }),

  approveProposal: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input }) => {
      const documentation = await prisma.documentation.update({
        where: {
          id: input.id
        },
        data: {
          status: 'accepted'
        }
      })
      const rating = await prisma.documentationWithRating.create({
        data: {
          documentationId: input.id,
          avg: 0,
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          total: 0,
        }
      })
      return documentation
    }),

  declineProposal: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ input }) => {
      return prisma.documentation.update({
        where: {
          id: input.id
        },
        data: {
          status: 'declined'
        }
      })
    }),

  getDocumentation: publicProcedure
    .input(z.object({
      searchFilter: z.string(),
      direction: z.union([z.literal('asc'), z.literal('desc')]),
      pageIndex: z.number(),
      field: z.string(),
      pageSize: z.number(),
      language: z.union([language, z.undefined()])
    }))
    .query(async ({ input, ctx }) => {
      const documentation = await prisma.documentation.findMany({
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
        orderBy: input.field === 'ratingSummary' ?
          {
            ratingSummary: {
              avg: input.direction
            }
          }
          : {
            [input.field]: input.direction
          },
        where: {
          OR: [
            {
              name: {
                contains: input.searchFilter,
                mode: 'insensitive'
              }
            },
            {
              packageName: {
                contains: input.searchFilter,
                mode: 'insensitive'
              },
            }
          ],
          status: 'accepted',
          language: input.language ? {
            equals: input.language
          } : undefined
        },
        include: {
          ratingSummary: true,
          ratings: !!ctx.session?.user?.id && {
            where: {
              userId: {
                equals: ctx.session.user.id
              }
            },
          }
        }
      })

      const count = await prisma.documentation.count({
        where: {
          status: 'accepted',
          name: {
            contains: input.searchFilter || undefined,
            mode: 'insensitive'
          },
          packageName: {
            contains: input.searchFilter || undefined,
            mode: 'insensitive'
          },
          language: input.language || undefined,
        }
      })

      const totalPages = Math.ceil(count / input.pageSize)

      return { totalPages, documentation }
    }),

  rateDocumentation: protectedProcedure
    .input(z.object({
      value: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
      documentationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const isUserAlreadyRated = await prisma.rating.findFirst({
        where: {
          userId: ctx.session.user.id,
          documentationId: input.documentationId
        }
      })

      if (isUserAlreadyRated) throw new Error('You already rated this')

      const documentationWithRating = await prisma.documentationWithRating.findFirst({
        where: {
          documentationId: input.documentationId
        }
      })

      let newAvg

      if (documentationWithRating?.avg && documentationWithRating?.total) {
        newAvg = (documentationWithRating.avg * documentationWithRating.total + input.value) / (documentationWithRating?.total + 1)
      }

      const variants = {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five'
      }

      const newRating = await prisma.rating.create({
        data: {
          value: input.value,
          documentationId: input.documentationId,
          userId: ctx.session.user.id,
        }
      })

      const updatedRatingSummary = await prisma.documentationWithRating.update({
        where: {
          documentationId: input.documentationId
        },
        data: {
          [variants[input.value]]: {
            increment: 1
          },
          total: {
            increment: 1
          },
          avg: {
            set: newAvg || input.value
          }
        }
      })

      return { updatedRatingSummary, newRating: [newRating] }
    }),
});