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
  getProposals: publicProcedure.query(() => {
    return prisma.proposal.findMany()
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
