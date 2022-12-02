import { router } from "../trpc";
import { authRouter } from "./auth";
import { documentationRouter } from "./documentation";

export const appRouter = router({
  documentation: documentationRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
