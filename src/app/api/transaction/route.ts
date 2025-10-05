import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📘 GET — fetch all transactions (or by user)

export const runtime = 'edge';
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId"); // optional filter
    const userId = userIdParam ? Number(userIdParam) : undefined; // ✅ Convert to number

    let transactions;

    if (userId) {
      // Fetch transactions for a specific user
      transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Fetch all transactions (for admin)
      transactions = await prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// 📘 POST — optionally allow adding mock or manual transactions (optional)
export async function POST(req: Request) {
  try {
    const { userId, amount, paymentMethod, status, type } = await req.json();

    if (userId || !amount || !paymentMethod || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Convert userId to number before inserting
    const transaction = await prisma.transaction.create({
      data: {
        userId: Number(userId),
        amount,
        paymentMethod,
        status: status || "Pending",
        type,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, transaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";