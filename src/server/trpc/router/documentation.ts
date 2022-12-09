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
      packageName: z
        .string()
        .min(2, "Package name is too short (minimum 2)")
        .trim(),
      docVersion,
      language
    }))
    .mutation(({ input }) => {
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
    .mutation(({ input }) => {
      return prisma.documentation.update({
        where: {
          id: input.id
        },
        data: {
          status: 'accepted'
        }
      })
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
      direction: z.union([z.literal('asc'), z.literal('desc')]),
      pageIndex: z.number(),
      field: z.string(),
      pageSize: z.number()
    }))
    .query(async ({ input }) => {

      let count
      let documentation
      let result

      if (input.field === 'ratings') {
        let avgRatings = await prisma.rating.groupBy({
          by: ['documentationId'],
          skip: input.pageIndex * input.pageSize,
          take: input.pageSize,
          _avg: {
            value: true
          },
          orderBy: {
            _avg: {
              value: input.direction
            },
          },
          _count: {
            documentationId: true
          }
        })

        count = await caller.getDocumentsWithRatingCount()

        documentation = await prisma.documentation.findMany({
          where: {
            id: {
              in: avgRatings.map(item => item.documentationId)
            }
          },
          include: {
            ratings: true
          }
        })

        result = documentation
          .map(doc => {
            const relatedAvgRating = avgRatings.find(rat => rat.documentationId === doc.id)
            return {
              ...doc,
              ratings: {
                _avg: relatedAvgRating?._avg.value,
                data: doc.ratings
              }
            }
          })
          .sort((a, b) => {
            return input.direction === 'asc' ? a.ratings._avg! - b.ratings._avg! : b.ratings._avg! - a.ratings._avg!
          })

      } else {
        count = await prisma.documentation.count({
          where: {
            status: 'accepted'
          }
        })
        documentation = await prisma.documentation.findMany({
          skip: input.pageIndex * input.pageSize,
          take: input.pageSize,
          where: {
            status: 'accepted'
          },
          orderBy: {
            [input.field]: input.direction
          },
          include: {
            ratings: true
          }
        })

        result = documentation.map(doc => {
          return {
            ...doc,
            ratings: {
              _avg: doc.ratings.reduce((acc, current) => acc += current.value, 0) / doc.ratings.length || null,
              data: [...doc.ratings]
            }
          }
        })
      }

      const totalPages = Math.ceil(count / input.pageSize)

      return {
        totalPages, documentation: result,
      }
    }),

  getDocumentsWithRatingCount: publicProcedure
    .query(async () => {
      const result = await prisma.documentation.count({
        where: {
          AND: [
            { status: 'accepted' },
            {
              ratings: {
                some: {
                  value: {
                    not: undefined
                  }
                }
              }
            }
          ]
        }
      })
      return result
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
      return prisma.rating.create({
        data: {
          value: input.value,
          userId: ctx.session.user.id,
          documentationId: input.documentationId,
        }
      })
    }),
});


const caller = documentationRouter.createCaller({ session: null, prisma })