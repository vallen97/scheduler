import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { EmployeeRouter } from "./employees";
import { organizationRouter } from "./Organization";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  employees: EmployeeRouter,
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
