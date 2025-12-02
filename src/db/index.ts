import { config } from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema.ts";

config();

const pool = new Pool({
	// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL is required
	connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, { schema });
