"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext"; // ✅ make sure you have AuthContext
import {
  FaWallet,
  FaHistory,
  FaPlusCircle,
  FaMoneyBillWave,
  FaListAlt,
  FaPaperPlane,
} from "react-icons/fa";

interface Balances {
  mainBalance: number;
  interestBalance: number;
  totalDeposit: number;
  totalEarn: number;
  roiCompleted: number;
  roiSpeed: number;
  roiRedeemed: number;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [balances, setBalances] = useState<Balances>({
    mainBalance: 0,
    interestBalance: 0,
    totalDeposit: 0,
    totalEarn: 0,
    roiCompleted: 0,
    roiSpeed: 0,
    roiRedeemed: 0,
  });
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function fetchBal() {
      if (!user) return;
      try {
        const res = await fetch(
          `/api/dashboard?user=${encodeURIComponent(user.email)}`
        );
        const json = await res.json();
        if (mounted) setBalances(json);
      } catch (e) {
        console.error("Failed to fetch balances:", e);
      }
    }
    fetchBal();
    const t = setInterval(fetchBal, 5000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [user]);

  const formatMoney = (val: any) =>
    typeof val === "number" && !isNaN(val) ? val.toFixed(2) : "0.00";

  return (
    <aside className="w-72 bg-[#0f1a36] text-slate-200 p-6 rounded-r-2xl h-screen sticky top-0 flex flex-col justify-between">
      <div>
        {/* Account Balance */}
        <div className="mb-8 border rounded-lg p-4 bg-[#0f2a57]">
          <h4 className="text-sm text-slate-300">
            Account Balance{" "}
            <span className="ml-2 text-xs px-2 py-1 bg-yellow-400 text-black rounded">
              USD
            </span>
          </h4>

          <div className="mt-3">
            <p className="text-xs text-slate-300">Main Balance</p>
            <p className="text-lg font-semibold mt-1">
              ${formatMoney(balances.mainBalance)}
            </p>

            <p className="text-xs text-slate-300 mt-3">Interest Balance</p>
            <p className="text-lg font-semibold mt-1">
              ${formatMoney(balances.interestBalance)}
            </p>

            <p className="text-xs text-slate-300 mt-3">Total Deposit</p>
            <p className="text-lg font-semibold mt-1">
              ${formatMoney(balances.totalDeposit)}
            </p>

            <p className="text-xs text-slate-300 mt-3">Total Earn</p>
            <p className="text-lg font-semibold mt-1">
              ${formatMoney(balances.totalEarn)}
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push("/addFunds")}
              className="flex-1 bg-green-500 text-white py-2 rounded"
            >
              Deposit
            </button>
            <button
              onClick={() => router.push("/investmentPlans")}
              className="flex-1 bg-slate-700 text-white py-2 rounded"
            >
              Invest
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          <div
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer bg-green-500/10 text-white"
          >
            <FaWallet /> Dashboard
          </div>

          <div
            onClick={() => router.push("/addFunds")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-white/5"
          >
            <FaPlusCircle /> Add Fund
          </div>

          <div
            onClick={() => router.push("/depositHistory")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-white/5"
          >
            <FaHistory /> Deposit History
          </div>

          <div className="text-slate-300 pt-4 border-t border-slate-700 mt-4 space-y-2">
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-white"
              onClick={() => router.push("/investmentPlans")}
            >
              <FaMoneyBillWave /> investment Plans
            </div>
            <div
              onClick={() => router.push("/transaction")}
              className="flex items-center gap-3 cursor-pointer hover:text-white"
            >
              <FaListAlt /> Transaction
            </div>
            <div
              onClick={() => router.push("/withdrawal")}
              className="flex items-center gap-3 cursor-pointer hover:text-white"
            >
              <FaPaperPlane /> Withdrawal
            </div>
            <div
              onClick={() => router.push("/withdrawalHistory")}
              className="flex items-center gap-3 cursor-pointer hover:text-white"
            >
              <FaPaperPlane /> Withdrawal History
            </div>
          </div>
        </nav>
      </div>

      {/* Logout */}
    </aside>
  );
}
