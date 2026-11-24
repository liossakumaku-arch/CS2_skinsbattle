import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client'; 
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

//const connectionString = process.env.DATABASE_URL || 'file:./prisma/dev.db';

const connectionString = 'file:./prisma/dev.db'; // Укажите точный путь

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || 
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
