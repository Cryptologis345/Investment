// src/app/api/deposit/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Create a deposit
export async function POST(req: Request) {
  try {
    const { user, amount, currency, address } = await req.json();

    if (!user || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Find user in database
    const existingUser = await prisma.user.findUnique({
      where: { email: user },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userEmail: user,
        amount: Number(amount),
        currency,
        address,
        status: "Pending",
      },
    });

    // Optionally simulate auto-confirm after 20 seconds (test mode)
    setTimeout(async () => {
      await prisma.deposit.update({
        where: { id: deposit.id },
        data: {
          status: "Completed",
        },
      });

      // Update balances
      await prisma.dashboard.update({
        where: { userEmail: user },
        data: {
          mainBalance: { increment: amount },
          totalDeposit: { increment: amount },
          totalEarn: { increment: amount * 0.1 },
          interestBalance: { increment: amount * 0.05 },
        },
      });
    }, 20000);

    return NextResponse.json({
      success: true,
      message: "Deposit created successfully",
      deposit,
    });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Failed to create deposit" },
      { status: 500 }
    );
  }
}

// GET: Retrieve all deposits for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");

    if (!user) {
      return NextResponse.json({ error: "Missing user" }, { status: 400 });
    }

    const deposits = await prisma.deposit.findMany({
      where: { userEmail: user },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deposits);
  } catch (error) {
    console.error("Fetch deposits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch deposits" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";