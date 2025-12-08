import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Use `DATABASE_URL` to match Neon / common env naming
const connectionString = process.env.DATABASE_URL!

// For server-side queries. `prepare: false` is recommended in some serverless
// environments to avoid prepared statement issues.
const client = postgres(connectionString, { prepare: false })
export const db = drizzle({ client, schema })

export * from "./schema"
