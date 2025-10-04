"use client";
import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";

export default function WithdrawalPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BTC");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleWithdraw() {
    if (!amount || !address) return alert("Fill in all fields");
    if (!user) return alert("Not logged in");

    const payload = {
      user: user.email,
      amount: parseFloat(amount),
      address,
      currency: method,
      type: "withdraw", // 🔥 changed from "withdraw" → "withdrawal"
    };

    console.log("Submitting withdrawal:", payload); // Debug log

    setLoading(true);
    try {
      const res = await fetch("/api/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data); // 🔥 log full backend response

      if (res.ok) {
        alert("Withdrawal submitted — now pending!");
        window.location.href = "/withdrawalHistory";
      } else {
        alert(data.error || "Failed to submit withdrawal");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit withdrawal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1130] text-white flex items-center justify-center">
      <div className="bg-[#0f274f] p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Withdraw Funds</h1>

        <label className="block text-sm mb-2">Amount (USD)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 mb-4"
        />

        <label className="block text-sm mb-2">Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 mb-4"
        >
          <option value="BTC">Bitcoin</option>
          <option value="USDT">Tether (ERC20)</option>
          <option value="ETH">Ethereum</option>
        </select>

        <label className="block text-sm mb-2">Wallet Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 mb-6"
        />

        <button
          disabled={loading}
          onClick={handleWithdraw}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Withdrawal"}
        </button>
      </div>
    </div>
  );
}
