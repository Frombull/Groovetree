import { createEnv } from '@t3-oss/env-nextjs'

import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.url().default('postgresql://postgres:postgres@127.0.0.1:54322/postgres'),
    JWT_SECRET: z.string(),
    API_URL: z.string(),
    S3_STORAGE_URL: z.url().default('http://127.0.0.1:54321/storage/v1/s3'),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_REGION: z.string(),

    SUPABASE_URL: z.url().default('http://127.0.0.1:54321'),
    SUPABASE_ANON_KEY: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
  },

  client: {
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    API_URL: process.env.API_URL,
    S3_STORAGE_URL: process.env.S3_STORAGE_URL,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_REGION: process.env.S3_REGION,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
})
