// src/lib/services/userService.ts
import { prisma } from "../prisma";

export async function createUser(data: {
  first_name?: string;
  last_name?: string;
  email: string;
  username: string;
  password_: string;
  phone_number?: string;
}) {
  return await prisma.user.create({ data });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({ where: { username } });
}
