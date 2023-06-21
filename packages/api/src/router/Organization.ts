import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const organizationRouter = router({
  createOrganization: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.employment.create({
        data: {
          name: input.name,
        },
      });
      return post;
    }),
  getAllOrganization: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.employment.findMany();
  }),
  findOrganizationById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.employment.findFirst({ where: { id: input } });
    }),
  updateOrganization: publicProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }: any) => {
      const updateOrganization = await ctx.prisma.employment.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      return updateOrganization;
    }),
  deleteOrganization: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employment.delete({ where: { id: input.id } });
    }),
});
