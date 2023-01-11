import { TRPCError } from '@trpc/server';
import { prisma } from './../../db/client';
import { protectedProcedure } from '../trpc';
import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { language, versionRange } from '../../../types/zodTypes';
// import docVersionHelpers from '../../../utils/docVersionHelpers';
import { Documentation } from '@prisma/client';


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
      versionRange,
      language
    }))
    .mutation(async ({ input }) => {
      const dublicate = await prisma.documentation.findFirst({
        where: {
          AND: [
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
          versionRange: [input.versionRange[0]!, input.versionRange[1]!],
          voteSummary: {
            create: {
              total: 0
            }
          }
        },
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

      return prisma.votesSummary.update({
        where: {
          documentationId: input.documentationId
        },
        data: {
          total: {
            increment: input.value,
          },
          votes: {
            create: {
              documentationId: input.documentationId,
              userId: ctx.session.user.id,
              value: input.value,
            }
          }
        },
        include: {
          votes: {
            where: {
              userId: ctx.session.user.id
            }
          }
        }
      })
    }),

  getPendingProposals: publicProcedure
    .input(z.object({
      direction: z.union([z.literal('asc'), z.literal('desc')]),
      field: z.string(),
      pageIndex: z.number(),
      pageSize: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const count = await prisma.documentation.count({
        where: {
          status: 'voting'
        }
      })
      const totalPages = Math.ceil(count / input.pageSize)

      const pendingProposals = await prisma.documentation.findMany({
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
        orderBy: input.field === 'voteSummary' ?
          {
            voteSummary: {
              total: input.direction
            }
          }
          : {
            [input.field]: input.direction
          },
        where: {
          status: 'voting'
        },
        include: {
          voteSummary: true,
          votes: !!ctx.session?.user?.id ? {
            where: {
              userId: {
                equals: ctx.session.user.id
              }
            },
          } : false
        }
      })

      return {
        totalPages, pendingProposals
      }
    }),

  approveProposal: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== 'admin') throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not allowed to approve proposals'
      })

      const documentation: Documentation = await prisma.documentation.update({
        where: {
          id: input.id
        },
        data: {
          status: 'accepted'
        }
      })

      const versionList = []
      for (let i = documentation.versionRange[0]!; i <= documentation.versionRange[1]!; i++) {
        versionList.push(i)
      }

      await prisma.ratingSummary.create({
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
      await prisma.ratingSummaryByVersion.createMany({
        data: versionList.map(version => ({
          documentationId: input.id,
          avg: 0,
          one: 0,
          two: 0,
          three: 0,
          four: 0,
          five: 0,
          total: 0,
          majorVersion: version
        })),

      })
      return documentation
    }),

  declineProposal: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      if (ctx.session.user.role !== 'admin') throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not allowed to decline proposals'
      })

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
      documentationId: z.string(),
      ratingSummaryByVersionId: z.string(),
      documentationVersion: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const isUserAlreadyRated = await prisma.rating.findFirst({
        where: {
          userId: ctx.session.user.id,
          documentationId: input.documentationId,
          documentationVersion: {
            equals: input.documentationVersion
          }
        }
      })

      if (isUserAlreadyRated) throw new Error('You already rated this')

      const documentationWithRating = await prisma.ratingSummary.findFirst({
        where: {
          documentationId: input.documentationId
        }
      })

      const documentationWithRatingByVersion = await prisma.ratingSummaryByVersion.findUniqueOrThrow({
        where: {
          id: input.ratingSummaryByVersionId,
        }
      })

      let newAvgForDocumentationWithRating
      let newAvgForDocumentationWithRationByVersion

      if (documentationWithRating?.avg && documentationWithRating?.total) {
        newAvgForDocumentationWithRating = (
          documentationWithRating.avg * documentationWithRating.total + input.value
        ) / (documentationWithRating?.total + 1)
      }

      if (documentationWithRatingByVersion?.avg && documentationWithRatingByVersion?.total) {
        newAvgForDocumentationWithRationByVersion = (
          documentationWithRatingByVersion.avg * documentationWithRatingByVersion.total + input.value
        ) / (documentationWithRatingByVersion?.total + 1)
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
          documentationVersion: input.documentationVersion,
          value: input.value,
          documentationId: input.documentationId,
          ratingSummaryByVersionId: input.ratingSummaryByVersionId,
          userId: ctx.session.user.id,
        }
      })

      const updatedRatingSummary = await prisma.ratingSummary.update({
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
            set: newAvgForDocumentationWithRating || input.value
          },
        },
      })


      await prisma.ratingSummaryByVersion.update({
        where: {
          id: input.ratingSummaryByVersionId
        },
        data: {
          [variants[input.value]]: {
            increment: 1
          },
          total: {
            increment: 1
          },
          avg: {
            set: newAvgForDocumentationWithRationByVersion || input.value
          }
        }
      })

      return { updatedRatingSummary, newRating: [newRating] }
    }),

  getDocumentationRatings: publicProcedure
    .input(z.object({
      id: z.string().nullish()
    }))
    .query(({ input, ctx }) => {
      if (!input.id) return

      return prisma.ratingSummaryByVersion.findMany({
        where: {
          documentationId: input.id,
        },
        orderBy: {
          majorVersion: 'desc'
        },
        include: {
          ratings: !!ctx.session?.user?.id ? {
            where: {
              userId: {
                equals: ctx.session.user.id
              }
            }
          } : false,
        }
      })
    })
})