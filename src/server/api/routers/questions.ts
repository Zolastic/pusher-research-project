import { z } from "zod";
import { pusherServer } from "~/lib/pusher";

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        part: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.question.findMany({
        where: {
          part: {
            startsWith: input.part,
          },
        },
      });

      // group questions by major part e.g. 2.1, 2.2
      const groupedQuestions = questions.reduce((acc: any, question) => {
        const majorPart = question.part.split('.').slice(0, 2).join('.');

        // check if an array for the major part exists yet e.g. if there is no array for questions in 2.2, create one
        if (!acc[majorPart]) {
          acc[majorPart] = [];
        }

        // push the questions to the corresponding array
        acc[majorPart].push(question);
        return acc;
      }, {});

      // sort questions within each group
      for (const majorPart in groupedQuestions) {
        groupedQuestions[majorPart].sort((a: any, b: any) => a.part.localeCompare(b.part));
      }

      // convert groupedQuestions from an object into an array so that the .map function can be used
      return Object.values(groupedQuestions);
    }),

  updateResponse: publicProcedure
    .input(
      z.object({
        id: z.string(),
        response: z.string(),
        part: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, response, part } = input;

      await pusherServer.trigger(part, "incoming-message", {
        id,
        response,
      });

      const question = await ctx.db.question.update({
        where: { id },
        data: { response },
      });
      return question;
    }),

  updateDone: publicProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
        part: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, done, part } = input;

      await pusherServer.trigger(part, "incoming-message", {
        id,
        done
      }); 

      const question = await ctx.db.question.update({
        where: { id },
        data: { done },
      });
      return question;
    })
});
