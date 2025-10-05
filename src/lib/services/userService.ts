// src/lib/services/userService.ts
import prisma from "../prisma"; // ✅ Fixed import - removed curly braces

export async function createUser(data: {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return await prisma.user.create({
    data: {
      firstName: data.first_name ?? "",
      lastName: data.last_name ?? "",
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
    },
  });
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUser(id: number, data: any) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

// Add other user service functions as needed...