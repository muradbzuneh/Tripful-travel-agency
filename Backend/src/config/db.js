import pkg from "pg";
import { env } from "./env.js";

const { Pool } = pkg;

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: String(env.db.password),
});

pool.on("connect", () => {
  console.log("✅ Database connected successfully");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error", err);
  process.exit(1);
});
console.log("DB USER USED BY NODE:", env.db.user);
console.log("DB PASSWORD TYPE:", typeof env.db.password);
