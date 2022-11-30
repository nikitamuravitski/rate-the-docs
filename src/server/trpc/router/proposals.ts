import { prisma } from '../../db/client';
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const proposalsRouter = router({
  createProposal: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      linkToDocs: z.string(),
      npmPackageName: z.string(),
      version: z.string(),
    }))
    .mutation(({ input }) => {
      return prisma.proposal.create({ data: { ...input, votes: 0 } })
    }),
  voteForProposal: publicProcedure
    .input(z.object({
      id: z.string(),
      newVotesAmount: z.number()
    }))
    .mutation(({ input }) => {
      return prisma.proposal.update({
        where: {
          id: input.id
        },
        data: {
          votes: input.newVotesAmount
        }
      })
    }),
  getPendingProposals: publicProcedure
    .input(z.object({
      pageIndex: z.number(),
      pageSize: z.number()
    }))
    .query(async ({ input }) => {
      const count = await prisma.proposal.count({
        where: {
          status: 'voting'
        }
      })
      const totalPages = Math.ceil(count / input.pageSize)
      const pendingProposals = await prisma.proposal.findMany({
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
        where: {
          status: 'voting'
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
      return prisma.proposal.update({
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
      return prisma.proposal.update({
        where: {
          id: input.id
        },
        data: {
          status: 'declined'
        }
      })
    }),
});
