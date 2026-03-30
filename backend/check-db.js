const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const runs = await prisma.workflowRun.findMany({
    orderBy: { startedAt: "desc" },
    take: 1,
    include: {
      nodeResults: true
    }
  });
  console.log(JSON.stringify(runs, null, 2));
}

main().finally(() => prisma.$disconnect());
