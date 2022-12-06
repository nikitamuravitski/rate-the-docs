import { protectedProcedure } from '../trpc';
import { prisma } from '../../db/client';
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
      pageIndex: z.number(),
      pageSize: z.number()
    }))
    .query(async ({ input }) => {
      const count = await prisma.documentation.count({
        where: {
          status: 'accepted'
        }
      })
      const totalPages = Math.ceil(count / input.pageSize)
      const documentation = await prisma.documentation.findMany({
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
        where: {
          status: 'accepted'
        },
        include: {
          ratings: true
        }
      })
      return {
        totalPages, documentation
      }
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
