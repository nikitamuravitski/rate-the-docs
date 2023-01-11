import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const packageInfoRouter = router({
  getPackageRegistrySearchInfo: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await fetch(`https://www.npmjs.com/search/suggestions?q=${input.query}`).then(res => res.json())
    }),
});
