import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        limit: 100,
        userId: posts.map((post) => post.authorId),
      })
    ).map((user) => ({
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    }));

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author || !author.username) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Could not find author for post ${post.id}`,
        });
      }

      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
    });
  }),
});