import { router } from "../trpc";
import { authRouter } from "./auth";
import { proposalsRouter } from "./proposals";

export const appRouter = router({
  proposals: proposalsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
