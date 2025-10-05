import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import emailjs from "emailjs-com";

export const runtime = 'edge';

export async function POST(req: Request)
{
  try {
    const { transactionId, newStatus } = await req.json();

    // Step 1: Find the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    // Step 2: Update transaction status (Approved / Rejected)
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: newStatus },
    });

    // Step 3: Fetch the user that made the transaction
    const user = await prisma.user.findUnique({
      where: { id: transaction.userId },
      select: { email: true, firstName: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Step 4: Notify user via email
    const templateParams = {
      to_email: user.email, // ✅ Send to the user who made the payment
      subject: `Your payment has been ${newStatus}`,
      message: `
        Hi ${user.firstName},
        
        Your payment of $${transaction.amount} via ${transaction.paymentMethod} 
        has been ${newStatus}.
        
        Transaction Ref: ${transaction.transactionRef}
        
        Thank you for using our platform.
      `,
    };

    // Step 5: Send email via EmailJS
    emailjs.init("JmQjPLQLPRNYM5Vgp"); // public key

    await emailjs.send(
      "service_kxp9p3i",     // service ID
      "templates_695nv8c",   // template ID
      templateParams,
      "JmQjPLQLPRNYM5Vgp"    // public key again (for verification)
    );

    // Step 6: Return success response
    return NextResponse.json(
      { success: true, message: `Transaction ${newStatus}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { success: false, message: "Approval failed" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";