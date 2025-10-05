import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Handle GET requests (fetch withdrawal history)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const withdrawals = await prisma.withdrawal.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, withdrawals });
  } catch (error) {
    console.error("❌ Error fetching withdrawals:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch withdrawal history" },
      { status: 500 }
    );
  }
}

// ✅ Handle POST requests (add a new withdrawal)
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
        amount: parseFloat(amount),
        method,
        status: status || "Pending",
      },
    });

    return NextResponse.json({ success: true, withdrawal });
  } catch (error) {
    console.error("❌ Error creating withdrawal:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create withdrawal" },
      { status: 500 }
    );
  }
}
