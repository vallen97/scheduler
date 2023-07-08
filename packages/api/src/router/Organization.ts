import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const organizationRouter = router({
  createOrganization: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        employeeID: z.string(),
        daysNotToWork: z.any(),
        employeesWorking: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.organization.create({
        data: {
          name: input.name,
          email: input.email,
          employeeID: input.employeeID,
          daysNotToWork: input.daysNotToWork,
          EmployeesWorking: input.employeesWorking,
        },
      });
      return post;
    }),
  getAllOrganization: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.organization.findMany();
  }),
  findOrganizationById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.organization.findFirst({ where: { id: input } });
    }),
  updateOrganization: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        employeeID: z.string(),
        daysNotToWork: z.any(),
        employeesWorking: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }: any) => {
      const updateOrganization = await ctx.prisma.organization.update({
        where: {
          id: input.id,
        },
        data: {
          organizationName: input.name,
          organizationemail: input.email,
          employeeID: input.employeeID,
          daysNotToWork: input.daysNotToWork,
          EmployeesWorking: input.employeesWorking,
        },
      });
      return updateOrganization;
    }),
  deleteOrganization: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.organization.delete({ where: { id: input.id } });
    }),
  deleteDate: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.daysNotToBeWorked.delete({ where: { id: input.id } });
    }),
  addDaysNotToBeWorked: publicProcedure
    .input(
      z.object({
        organizatonID: z.string(),
        date: z.date(),
        description: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.organization.update({
        where: { id: input.organizatonID },
        data: {
          daysNotToWork: {
            create: {
              date: input.date,
              description: input.description,
            },
          },
        },
      });
    }),
  getAllDaysNotToWork: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.daysNotToBeWorked.findMany();
  }),
  findDaysNotToWorkByOrganizationById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.daysNotToBeWorked.findFirst({ where: { id: input } });
    }),

  getAllDaysApprovedOff: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.daysApprovedOff.findMany();
  }),

  UpdateDaysApprovedOff: publicProcedure
    .input(
      z.object({
        id: z.number(),
        day: z.date(),
        approvedByID: z.string(),
        approvedByName: z.string(),
        dateApproved: z.date(),
        timeApproved: z.date(),
        isApproved: z.boolean(),
        employeeID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateDaysApprovedOff = await ctx.prisma.daysApprovedOff.update({
        where: {
          id: input.id,
        },
        data: {
          day: input.day,
          approvedByID: input.approvedByID,
          approvedByName: input.approvedByName,
          dateApproved: input.dateApproved,
          timeApproved: input.timeApproved,
          isApproved: input.isApproved,
          employeeID: input.employeeID,
        },
      });
      return updateDaysApprovedOff;
    }),
});

/* 
  day            DateTime
  approvedByID   String
  approvedByName String
  dateApproved   DateTime
  timeApproved   DateTime
  isApproved     Boolean
  employeeID     String
*/
