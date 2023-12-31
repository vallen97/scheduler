import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const EmployeeRouter = router({
  createEmployee: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        organizationID: z.string(), // Note: we might beable to get the organization name from the ID
        organizationName: z.string(),
        role: z.any(), // Todo: meed to make a prisma type to get the roles. On the organization page we should allow the manager to set the toels
        DaysToWork: z.any(),
        daysApproved: z.any(),
        numberOfDaysOff: z.number(),
        sickDays: z.number(),
        paidTimeOff: z.number(),
        clerkID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const employee = await ctx.prisma.employee.create({
        data: {
          email: input.email,
          name: input.name,
          organizationID: input.organizationID,
          organizationName: input.organizationName,
          role: input.role,
          DaysToWork: input.DaysToWork,
          daysApproved: input.daysApproved,
          numberOfDaysOff: input.numberOfDaysOff,
          sickDays: input.sickDays,
          paidTimeOff: input.paidTimeOff,
          clerkID: input.clerkID,
        },
      });
      return employee;
    }),
  getAllEmployees: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.employee.findMany();
  }),
  findEmployeeById: publicProcedure
    .input(z.object({ clerkID: z.any() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.employee.findFirst({
        where: { clerkID: input.clerkID },
      });
    }),
  updateEmplayee: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        organizationID: z.string(),
        organizationName: z.string(),
        role: z.any(),
        DaysToWork: z.any(),
        daysApproved: z.any(),
        numberOfDaysOff: z.number(),
        sickDays: z.number(),
        paidTimeOff: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }: any) => {
      const updateEmployee = await ctx.prisma.employee.update({
        where: {
          id: input.id,
        },
        data: {
          email: input.email,
          name: input.name,
          organizationID: input.organizationID,
          organizationName: input.organizationName,
          role: input.role,
          DaysToWork: input.DaysToWork,
          daysApproved: input.daysApproved,
          numberOfDaysOff: input.numberOfDaysOff,
          sickDays: input.sickDays,
          paidTimeOff: input.paidTimeOff,
        },
      });
      return updateEmployee;
    }),
  updateEmplayeeOrgID: publicProcedure
    .input(
      z.object({
        id: z.string(),
        organizationID: z.string(),
        organizationName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }: any) => {
      const updateEmployee = await ctx.prisma.employee.update({
        where: {
          id: input.id,
        },
        data: {
          organizationID: input.organizationID,
          organizationName: input.organizationName,
        },
      });
      return updateEmployee;
    }),
  deleteEmployee: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employee.delete({ where: { id: input.id } });
    }),
  addDaysToWork: publicProcedure
    .input(
      z.object({
        id: z.string(),
        day: z.date(),
        startTime: z.date(),
        endTime: z.date(),
        employee: z.any(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employee.update({
        where: { id: input.id },
        data: {
          DaysToWork: {
            create: {
              day: input.day,
              startTime: input.startTime,
              endTime: input.endTime,
            },
          },
        },
      });
    }),
  daysApprovedOff: publicProcedure
    .input(
      z.object({
        day: z.date(),
        approvedByID: z.string(),
        approvedByName: z.string(),
        dateApproved: z.date(),
        timeApproved: z.date(),
        employeeID: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employee.update({
        where: { id: input.employeeID },
        data: {
          daysApproved: {
            create: {
              day: input.day,
              approvedByID: input.approvedByID,
              approvedByName: input.approvedByName,
              dateApproved: input.dateApproved,
              timeApproved: input.timeApproved,
              isApproved: false,
            },
          },
        },
      });
    }),
  getRequestedDaysOff: publicProcedure
    .input(
      z.object({
        employeeID: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.daysApprovedOff.findMany({
        where: { employeeID: input.employeeID },
      });
    }),
  deleteRequestedDayOff: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.daysApprovedOff.delete({
        where: { id: input.id },
      });
    }),
  updateEmployeeRole: publicProcedure
    .input(z.object({ clerkID: z.any() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employee.update({
        where: { clerkID: input.clerkID },
        data: {
          role: "OWNER",
        },
      });
    }),
  getAllEmployeesByOrgID: publicProcedure
    .input(z.object({ orgID: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.employee.findMany({
        where: { organizationID: input.orgID },
      });
    }),

  removeOrgID: publicProcedure
    .input(z.object({ employeeID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.employee.update({
        where: { id: input.employeeID },
        data: {
          organizationID: null,
          organizationName: null,
        },
      });
    }),
});
