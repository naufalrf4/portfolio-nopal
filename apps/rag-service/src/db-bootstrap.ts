import { sql } from "./db";
import { config } from "./config";

async function bootstrap(): Promise<void> {
  console.log("[bootstrap] Checking database connectivity...");

  try {
    const results = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.schemata WHERE schema_name = 'rag'
      ) AS rag_schema_exists
    `;
    const schemaExists = results[0]?.rag_schema_exists === true;

    if (!schemaExists) {
      console.log("[bootstrap] Creating rag schema...");
      await sql.unsafe("CREATE SCHEMA IF NOT EXISTS rag");
      console.log("[bootstrap] rag schema created.");
    } else {
      console.log("[bootstrap] rag schema already exists.");
    }

    await sql.unsafe("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("[bootstrap] vector extension ready.");

    const tableCheck = await sql`
      SELECT tablename FROM pg_catalog.pg_tables
      WHERE schemaname = 'rag'
        AND tablename IN ('documents', 'chunks', 'ingestion_runs')
    `;
    const found = tableCheck.map((r) => r.tablename as string);
    console.log(`[bootstrap] Found rag tables: ${found.join(", ") || "none"}`);

    if (found.length < 3) {
      console.warn(
        "[bootstrap] Some rag tables are missing. Admin owns schema migrations. " +
          "Run Admin Drizzle migrations first, then re-run bootstrap.",
      );
    }

    console.log(`[bootstrap] Connected to: ${config.databaseUrl.replace(/\/\/.*@/, "//***@")}`);
    console.log("[bootstrap] Database bootstrap complete.");

    await sql.end();
    process.exit(0);
  } catch (err) {
    console.error("[bootstrap] Database bootstrap failed:", err);
    await sql.end().catch(() => {});
    process.exit(1);
  }
}

bootstrap();
