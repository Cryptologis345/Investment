import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'edge';
type WithdrawalRequest = {
  userId: number;
  amount: number;
  status?: string;
};

// GET — fetch withdrawals (optionally by user)
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const withdrawals = await prisma.withdrawal.findMany({
      where: userId ? { userId: Number(userId) } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, withdrawals }, { status: 200 });
  } catch (error) {
    console.error("Withdrawal fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
};

// POST — create a new withdrawal
export const POST = async (req: Request) => {
  try {
    const { userId, amount, status }: WithdrawalRequest = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        status: status || "Pending",
      },
    });

    return NextResponse.json({ success: true, withdrawal }, { status: 201 });
  } catch (error) {
    console.error("Withdrawal creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create withdrawal" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
