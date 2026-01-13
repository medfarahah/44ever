import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

// Type definitions
// declare global {
//   var prisma: PrismaClient | undefined
// }

const connectionString = process.env.DATABASE_URL;

// Don't throw error on import - let it fail gracefully at runtime
if (!connectionString || connectionString.includes('YourPassword')) {
  console.warn('⚠️ DATABASE_URL is not set or contains placeholder!');
  console.warn('Database operations will fail until DATABASE_URL is configured.');
}

if (connectionString && !connectionString.includes('YourPassword')) {
  console.log('✅ DATABASE_URL is set:', connectionString.substring(0, 30) + '...');
}

const adapter = (connectionString && !connectionString.includes('YourPassword'))
  ? new PrismaNeon({ connectionString })
  : null;

const prisma = global.prisma || (adapter
  ? new PrismaClient({ adapter })
  : new PrismaClient());

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
