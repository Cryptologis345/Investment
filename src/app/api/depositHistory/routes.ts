// src/app/api/depositHistory/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retrieve deposit history for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");

    if (!user) {
      return NextResponse.json({ error: "Missing user" }, { status: 400 });
    }

    // Fetch deposits linked to user
    const depositHistory = await prisma.deposit.findMany({
      where: { userEmail: user },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(depositHistory);
  } catch (error) {
    console.error("Error fetching deposit history:", error);
    return NextResponse.json(
      { error: "Failed to fetch deposit history" },
      { status: 500 }
    );
  }
}
