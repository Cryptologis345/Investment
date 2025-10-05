// src/app/api/depositHistory/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'edge';
export async function GET(req: Request)
{
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("user");
    if (!userEmail) return NextResponse.json([], { status: 200 });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json([], { status: 200 });

    const deposits = await prisma.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deposits);
  } catch (err) {
    console.error("GET /depositHistory error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
export const dynamic = "force-dynamic";