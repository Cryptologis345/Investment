import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path if needed

// POST /api/auth/signup
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      phone,
    } = data;

    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user record
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email: email.toLowerCase(),
        password, // 🔒 plain text since you’re avoiding hashing
        phone: phone || null,
        mainBalance: 0,
        investmentBalance: 0,
        totalEarn: 0,
        totalDeposit: 0,
        roi: 0,
        redeemedRoi: 0,
        speedInvest: 0,
        completed: 0,
      },
    });

    return NextResponse.json({
      message: "Signup successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        mainBalance: newUser.mainBalance,
        totalDeposit: newUser.totalDeposit,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
