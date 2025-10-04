// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ This line exports prisma as the default export
export default prisma;
