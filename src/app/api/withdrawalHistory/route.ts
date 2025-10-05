import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET — Fetch withdrawal history (all or by user)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const withdrawals = await prisma.withdrawal.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, withdrawals },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Withdrawal history fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch withdrawal history" },
      { status: 500 }
    );
  }
}

// ✅ POST — Add a new withdrawal record (optional)
export async function POST(req: Request) {
  try {
    const { userId, amount, method, status } = await req.json();

    if (!userId || !amount || !method) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        method,
        status: status || "Pending",
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, withdrawal },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Withdrawal creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create withdrawal" },
      { status: 500 }
    );
  }
}


export const dynamic = "force-dynamic";