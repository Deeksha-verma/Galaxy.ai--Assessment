import { prisma } from "../common/services/database.service";
import { createClerkClient } from "@clerk/backend";
import { config } from "../common/helper/config.helper";

export const upsertUser = async (data: { id: string; email: string; name?: string }) => {
  return await prisma.user.upsert({
    where: { id: data.id },
    update: {
      email: data.email,
      name: data.name,
    },
    create: {
      id: data.id,
      email: data.email,
      name: data.name,
    },
  });
};

export const ensureUserSync = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const clerk = createClerkClient({ secretKey: config.CLERK_SECRET_KEY });
    const clerkUser = await clerk.users.getUser(userId);

    return await upsertUser({
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "missing-email@clerk.user",
      name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : undefined,
    });
  }
  return user;
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
