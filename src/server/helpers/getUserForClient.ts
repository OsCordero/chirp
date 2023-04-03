import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

type Params = Parameters<typeof clerkClient.users.getUserList>[0];

export const getUserForClient = async (params?: Params) => {
  const [user] = (await clerkClient.users.getUserList(params)).map((user) => ({
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  }));

  if (!user || !user.username) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found.",
    });
  }

  return {
    ...user,
    username: user.username,
  };
};
