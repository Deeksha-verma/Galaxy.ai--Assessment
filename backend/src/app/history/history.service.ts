import { prisma } from "../common/services/database.service";

export const listHistory = async (userId: string, workflowId?: string) => {
  return await prisma.workflowRun.findMany({
    where: {
      userId,
      ...(workflowId ? { workflowId } : {}),
    },
    orderBy: { startedAt: "desc" },
    include: {
      workflow: { select: { name: true } },
    },
  });
};

export const getRunDetail = async (userId: string, runId: string) => {
  const run = await prisma.workflowRun.findUnique({
    where: { id: runId },
    include: {
      workflow: { select: { name: true, userId: true } },
      nodeResults: {
        orderBy: { startedAt: "asc" },
      },
    },
  });

  if (!run) throw new Error("Run not found");
  if (run.workflow.userId !== userId) throw new Error("Forbidden access");

  return run;
};
