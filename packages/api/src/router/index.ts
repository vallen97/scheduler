import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { EmployeeRouter } from "./employees";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  employees: EmployeeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
