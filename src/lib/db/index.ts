import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { serverEnv } from "@/config/env/server";
import * as schema from "@/lib/db/schema";

const pool = new Pool({
	connectionString: serverEnv.DATABASE_URL,
});
const getDatabase = createServerOnlyFn(() => drizzle(pool, { schema }));

export const db = getDatabase();
