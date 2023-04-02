import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = (
        await clerkClient.users.getUserList({
          username: [input.username],
        })
      ).map((user) => ({
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
      }));

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User ${input.username} not found.`,
        });
      }
      return user;
    }),
});
