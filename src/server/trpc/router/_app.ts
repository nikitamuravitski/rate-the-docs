import { router } from "../trpc";
import { authRouter } from "./auth";
import { documentationRouter } from "./documentation";
import { packageInfoRouter } from './packageInfo'

export const appRouter = router({
  documentation: documentationRouter,
  packageInfo: packageInfoRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
