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
        partOrder: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const part = await ctx.db.part.findFirst({
        where: {
          order: input.partOrder
        }
      })

      if (!part) throw new Error("Part not found")

      const sections = await ctx.db.section.findMany({
      where: {
          partId: part.id
        }
      })

      if (!sections) throw new Error("Section not found")

      const partQuestions = await Promise.all(
        sections.map(async (section) => {
          const sectionQuestions = await ctx.db.question.findMany({
            where: {
              sectionId: section.id
            }
          });
          return sectionQuestions;
        })        
      )
      
      return partQuestions;
    }),

    updateResponse: publicProcedure
    .input(
      z.object({
        id: z.string(),
        response: z.string(),
        part: z.string(),
        editing: z.boolean(), // New input to indicate if the user is editing
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, response, part, editing } = input;

      // Trigger Pusher event for real-time updates
      await pusherServer.trigger(part, "incoming-message", {
        id,
        response,
        editing,
      });

      // Update the database with the new response and editing status
      const question = await ctx.db.question.update({
        where: { id },
        data: { response, editing },
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
