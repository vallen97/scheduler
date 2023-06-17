import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const EmployeeRouter = router({
  createEmployee: protectedProcedure
    .input(z.object({ email: z.string(), name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.employee.create({
        data: { email: input.email, name: input.name },
      });
    }),
  getAllEmployees: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.employee.findMany();
  }),
  findEmployeeById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.employee.findFirst({ where: { id: input } });
    }),
  deleteEmployee: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employee.delete({ where: { id: input.id } });
    }),
});
