// app/deposit/page.tsx
"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/context/AuthContext";

export default function DepositPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          address: "random-wallet-address",
          currency: "BTC",
          user: user?.email,
        }),
      });
      const json = await res.json();
      console.log("Deposit created:", json);
      setAmount("");
    } catch (err) {
      console.error("Deposit failed", err);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#0b1130] text-slate-200">
        <h1 className="text-3xl font-semibold mb-6">Make a Deposit</h1>
        <form
          onSubmit={handleDeposit}
          className="bg-slate-800/50 p-6 rounded max-w-md space-y-4"
        >
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-2 rounded bg-slate-900 border border-slate-700"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
          >
            Deposit
          </button>
        </form>
      </main>
    </div>
  );
}
