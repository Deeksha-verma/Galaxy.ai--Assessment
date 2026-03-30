import { createApp } from "./app";
import { config } from "./app/common/helper/config.helper";

const startServer = async () => {
  const app = createApp();

  app.listen(config.PORT, () => {
    console.log(`🔌 NextFlow Backend running on http://localhost:${config.PORT}`);
    console.log(`✅ Database URL: mapped securely via Prisma`);
    console.log(`✅ Trigger.dev keys: ${config.TRIGGER_SECRET_KEY ? "Loaded" : "Missing"}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
