import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const generateSSGHelper = () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { user: null, prisma: prisma },
    transformer: SuperJSON,
  });
  return ssg;
};
