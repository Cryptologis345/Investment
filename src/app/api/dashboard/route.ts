import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Helper: default dashboard data
function getDefaultStats() {
  return {
    mainBalance: 0,
    interestBalance: 0,
    totalDeposit: 0,
    totalEarn: 0,
    stats: {
      investCompleted: 0,
      roiSpeed: 0,
      roiRedeemed: 0,
    },
    pendingDeposits: [],
    depositHistory: [],
  };
}

// ✅ GET: Fetch dashboard data
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("user");

    if (!userEmail)
      return NextResponse.json({ error: "User email required" }, { status: 400 });

    // ✅ Find the user (no include: dashboards)
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) return NextResponse.json(getDefaultStats());

    // ✅ Fetch deposits
    const deposits = await prisma.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const pendingDeposits = deposits.filter((d) => d.status === "Pending");

    // ✅ Build response using user fields
    const result = {
      mainBalance: user.mainBalance,
      interestBalance: user.investmentBalance,
      totalDeposit: user.totalDeposit,
      totalEarn: user.totalEarn,
      stats: {
        investCompleted: user.completed,
        roiSpeed: user.speedInvest,
        roiRedeemed: user.redeemedRoi,
      },
      pendingDeposits,
      depositHistory: deposits,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /dashboard error:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}

// ✅ POST: Handle deposits & withdrawals
export async function POST(req: Request) {
  try {
    const { user, amount, address, currency, type } = await req.json();

    if (!user)
      return NextResponse.json({ error: "No user provided" }, { status: 400 });
    if (!amount || amount <= 0)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    const userRecord = await prisma.user.upsert({
      where: { email: user },
      update: {},
      create: { email: user, firstName: "", lastName: "", username: user.split("@")[0] || user, password: "" },
    });

    if (type === "deposit") {
      const deposit = await prisma.deposit.create({
        data: {
          userId: userRecord.id,
          amount: Number(amount),
          address,
          currency,
          status: "Pending",
        },
      });

      // create transaction record referencing deposit
      await prisma.transaction.create({
        data: {
          userId: userRecord.id,
          type: "deposit",
          amount: Number(amount),
          description: `deposit:${deposit.id}`,
          status: "Pending",
        },
      });

      // DO NOT auto-approve here — admin must approve via email link
      return NextResponse.json({ success: true, deposit });
    }

    if (type === "withdraw") {
      // check balance
      if (userRecord.mainBalance < Number(amount)) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      // create withdrawal record in withdrawal table OR use Deposit model? (you have withdrawal model earlier)
      const withdrawal = await prisma.withdrawal.create({
        data: {
          userId: userRecord.id,
          amount: Number(amount),
          address,
          currency,
          status: "Pending",
        },
      });

      // create transaction entry
      await prisma.transaction.create({
        data: {
          userId: userRecord.id,
          type: "withdraw",
          amount: Number(amount),
          description: `withdrawal:${withdrawal.id}`,
          status: "Pending",
        },
      });

      // deduct from user's balance immediately if that's desired
      await prisma.user.update({
        where: { id: userRecord.id },
        data: {
          mainBalance: { decrement: Number(amount) },
        },
      });

      return NextResponse.json({ success: true, withdrawal });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("POST /dashboard error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";