import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getUserForClient } from "~/server/helpers/getUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await getUserForClient({
        username: [input.username],
      });

      return {
        ...user,
        username: user.username,
      };
    }),
});
