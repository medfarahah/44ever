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

if (!connectionString || connectionString.includes('YourPassword')) {
  console.error('❌ DATABASE_URL is not set or contains placeholder!');
  console.error('Please update server/.env with your actual Neon database connection string.');
  console.error('Get it from: https://console.neon.tech');
  throw new Error('DATABASE_URL environment variable is required and must have a valid password');
}

console.log('✅ DATABASE_URL is set:', connectionString.substring(0, 30) + '...');

const adapter = new PrismaNeon({ connectionString });
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
