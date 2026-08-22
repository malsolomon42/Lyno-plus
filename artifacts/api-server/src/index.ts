import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  await runMigrations({ databaseUrl: process.env.DATABASE_URL });
  const sync = await getStripeSync();
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (domain) await sync.findOrCreateManagedWebhook(`https://${domain}/api/stripe/webhook`);
  sync.syncBackfill().catch((error) => logger.error({ error }, "Stripe backfill failed"));
  app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  });
}

start().catch((error) => {
  logger.error(
    { error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error) },
    "API server startup failed",
  );
  process.exit(1);
});
