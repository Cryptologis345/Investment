// src/app/api/withdrawalHistory/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all withdrawals
export async function GET(req: Request) {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}

// POST a new withdrawal
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.userId || !data.amount) {
      return NextResponse.json(
        { error: "Missing required fields: userId or amount" },
        { status: 400 }
      );
    }

    const newWithdrawal = await prisma.withdrawal.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        status: "Pending", // default
      },
    });

    return NextResponse.json(newWithdrawal, { status: 201 });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    return NextResponse.json({ error: "Failed to create withdrawal" }, { status: 500 });
  }
}
