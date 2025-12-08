import { defineConfig } from 'drizzle-kit'
import { serverEnv } from '@/config/env/server'

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
})
