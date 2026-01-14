// prisma.config.ts

import 'dotenv/config';
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.resolve(process.cwd(), 'prisma/schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: path.resolve(process.cwd(), 'prisma/migrations'),
    seed: 'ts-node prisma/seed.ts', 
    // <-- this tells Prisma which seed script to run
  },
  
});
