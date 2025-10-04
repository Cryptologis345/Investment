import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper: default dashboard object
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

    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        dashboards: true,
      },
    });

    if (!user) return NextResponse.json(getDefaultStats());

    const dashboard = user.dashboards[0];

    // Fetch deposits
    const deposits = await prisma.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const pendingDeposits = deposits.filter((d) => d.status === "Pending");
    const depositHistory = deposits;

    const result = {
      mainBalance: dashboard?.mainBalance ?? 0,
      interestBalance: dashboard?.interestBalance ?? 0,
      totalDeposit: dashboard?.totalDeposit ?? 0,
      totalEarn: dashboard?.totalEarn ?? 0,
      stats: {
        investCompleted: dashboard?.investCompleted ?? 0,
        roiSpeed: dashboard?.roiSpeed ?? 0,
        roiRedeemed: dashboard?.roiRedeemed ?? 0,
      },
      pendingDeposits,
      depositHistory,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /dashboard error:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}

// ✅ POST: Add deposit or withdrawal
export async function POST(req: Request) {
  try {
    const { user, amount, address, currency, type } = await req.json();

    if (!user) return NextResponse.json({ error: "No user provided" }, { status: 400 });
    if (!amount || amount <= 0)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    const userRecord = await prisma.user.upsert({
      where: { email: user },
      update: {},
      create: { email: user },
    });

    let dashboard = await prisma.dashboard.findFirst({
      where: { userId: userRecord.id },
    });

    if (!dashboard) {
      dashboard = await prisma.dashboard.create({
        data: { userId: userRecord.id },
      });
    }

    if (type === "deposit") {
      const deposit = await prisma.deposit.create({
        data: {
          userId: userRecord.id,
          amount,
          address,
          currency,
          status: "Pending",
        },
      });

      // Simulate auto-confirm after 20s
      setTimeout(async () => {
        await prisma.deposit.update({
          where: { id: deposit.id },
          data: { status: "Completed" },
        });

        await prisma.dashboard.update({
          where: { id: dashboard.id },
          data: {
            mainBalance: dashboard.mainBalance + amount,
            totalDeposit: dashboard.totalDeposit + amount,
            totalEarn: dashboard.totalEarn + amount * 0.1,
            interestBalance: dashboard.interestBalance + amount * 0.05,
            investCompleted: dashboard.investCompleted + 1,
            roiRedeemed: dashboard.roiRedeemed + amount * 0.05,
            roiSpeed: dashboard.roiSpeed + amount * 0.02,
          },
        });
      }, 20000);

      return NextResponse.json({ success: true, deposit });
    }

    if (type === "withdraw") {
      if (dashboard.mainBalance < amount) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      const withdrawal = await prisma.withdrawal.create({
        data: {
          userId: userRecord.id,
          amount,
          address,
          currency,
          status: "Pending",
        },
      });

      await prisma.dashboard.update({
        where: { id: dashboard.id },
        data: {
          mainBalance: dashboard.mainBalance - amount,
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
