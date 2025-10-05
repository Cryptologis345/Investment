import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust if your prisma client is stored elsewhere

// POST /api/auth/signin
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Simple login logic (no hashing)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Return user data
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        mainBalance: user.mainBalance,
        totalDeposit: user.totalDeposit,
        totalWithdraw: user.totalWithdraw,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";