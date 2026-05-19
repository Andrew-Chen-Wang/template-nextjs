import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import type { DB } from "./types"

// Re-define __dirname since we are using JS when generating OpenAPI specs in apps/internal-api
const currentFilename = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFilename)

dotenv.config({ path: `${currentDir}/../../../.env`, quiet: true })

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
})

export const db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
})

export type { DB }
