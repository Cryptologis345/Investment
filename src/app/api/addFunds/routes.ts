import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import emailjs from "emailjs-com";

export async function POST(req: Request) {
  try {
    const { userId, amount, paymentMethod, transactionRef } = await req.json();

    // 1️⃣ Create pending transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        paymentMethod,
        transactionRef,
        status: "Pending",
        createdAt: new Date(),
      },
    });

    // 2️⃣ Generate approval links
    const approveUrl = `https://yourwebsite.com/api/addFunds/approve?transactionId=${transaction.id}&action=approve`;
    const rejectUrl = `https://yourwebsite.com/api/addFunds/approve?transactionId=${transaction.id}&action=reject`;

    // 3️⃣ Send email to admin
    const templateParams = {
      to_email: "evaa.rileyy592@gmail.com", // admin mail
      subject: "Payment Confirmation Awaiting Approval",
      message: `
        A user just confirmed a payment.

        🔹 User ID: ${userId}
        💰 Amount: $${amount}
        💳 Method: ${paymentMethod}
        🧾 Transaction Ref: ${transactionRef}

        Approve or reject the payment using the links below:
         Approve: ${approveUrl}
         Reject: ${rejectUrl}
      `,
    };

    // Initialize and send via EmailJS
    emailjs.init("JmQjPLQLPRNYM5Vgp");

    await emailjs.send(
      "service_kxp9p3i",
      "templates_695nv8c",
      templateParams,
      "JmQjPLQLPRNYM5Vgp"
    );

    return NextResponse.json(
      { success: true, message: "Payment confirmation sent to admin." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add funds error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";