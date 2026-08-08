import postgres from "postgres";
import { config } from "./config";

const sql = postgres(config.databaseUrl, {
  transform: postgres.camel,
  debug: config.logLevel === "DEBUG",
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
});

export { sql };
export type Sql = typeof sql;
