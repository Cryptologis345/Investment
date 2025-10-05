// src/app/api/investmentPlans/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// In-memory fallback if no DB yet
export const runtime = 'edge';
let investments: Record<string, any[]> = (global as any).investments || {};
(global as any).investments = investments;

// Default investment plans (same as frontend)
const plans = [
  { id: 1, name: "Starter Plan", roi: 0.05, durationDays: 7, min: 50 },
  { id: 2, name: "Pro Plan", roi: 0.1, durationDays: 14, min: 200 },
  { id: 3, name: "Elite Plan", roi: 0.15, durationDays: 30, min: 500 },
];

// POST: Start a new investment
export async function POST(req: Request) {
  try {
    const { user, planId, amount } = await req.json();

    if (!user) {
      return NextResponse.json({ error: "Missing user" }, { status: 400 });
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (amount < plan.min) {
      return NextResponse.json(
        { error: `Minimum investment for ${plan.name} is $${plan.min}` },
        { status: 400 }
      );
    }

    // ✅ Create investment record (temporary in-memory version)
    const investment = {
      id: Date.now(),
      planName: plan.name,
      amount,
      roiPercent: plan.roi * 100,
      durationDays: plan.durationDays,
      userEmail: user,
      status: "Active",
      createdAt: new Date(),
      maturityDate: new Date(Date.now() + plan.durationDays * 86400000), // Add days
    };

    if (!investments[user]) investments[user] = [];
    investments[user].unshift(investment);

    // Auto-complete after duration
    setTimeout(() => {
      investment.status = "Completed";
    }, 5000); // ⏱ shorten for test (5 sec)

    return NextResponse.json({ success: true, investment });
  } catch (err) {
    console.error("Error creating investment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: Get all user investments
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  if (!user) {
    return NextResponse.json({ error: "Missing user" }, { status: 400 });
  }

  const userInvestments = investments[user] || [];
  return NextResponse.json(userInvestments);
}
export const dynamic = "force-dynamic";