import { z } from "zod";
import { pusherServer } from "~/lib/pusher";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.question.findMany();
  }),

  updateResponse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        response: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, response } = input;

      await pusherServer.trigger("pusherResearchProject", "incoming-message", {
        id,
        response,
      });

      const question = await ctx.db.question.update({
        where: { id },
        data: { response },
      });
      return question;
    }),
});
