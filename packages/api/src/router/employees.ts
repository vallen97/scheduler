import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const EmployeeRouter = router({
  createEmployee: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.employee.create({
        data: {
          email: input.email,
          name: input.name,
        },
      });
      return post;
    }),
  getAllEmployees: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.employee.findMany();
  }),
  findEmployeeById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.employee.findFirst({ where: { id: input } });
    }),
  updateEmplayee: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }: any) => {
      const updateEmployee = await ctx.prisma.employee.update({
        where: {
          id: input.id,
        },
        data: {
          email: input.email,
          name: input.name,
        },
      });
      return updateEmployee;
    }),
  deleteEmployee: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employee.delete({ where: { id: input.id } });
    }),
});
