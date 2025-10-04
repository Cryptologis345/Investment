"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

interface TransactionItem {
  id: number;
  amount: number;
  address: string;
  currency: string;
  status: string;
  createdAt: string;
}

export default function Transaction() {
  const { user } = useAuth();
  const [depositHistory, setDepositHistory] = useState<TransactionItem[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<TransactionItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTransactions() {
      if (!user) return;
      try {
        const res = await fetch(
          `/api/dashboard?user=${encodeURIComponent(user.email)}`
        );
        const json = await res.json();
        setDepositHistory(json.depositHistory || []);
        setWithdrawalHistory(json.withdrawalHistory || []);
      } catch (e) {
        console.error("Failed to fetch transactions:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1130] text-white flex items-center justify-center">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1130] text-white p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      {/* Deposit History */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Deposit History</h2>
        {depositHistory.length === 0 ? (
          <p className="text-slate-400">No deposits yet.</p>
        ) : (
          <table className="w-full bg-[#0f274f] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#152d52]">
                <th className="p-3 text-left">Transaction ID</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {depositHistory.map((dep) => (
                <tr key={dep.id} className="border-t border-slate-700">
                  <td className="p-3 text-xs text-slate-400">{dep.id}</td>
                  <td className="p-3">${dep.amount}</td>
                  <td className="p-3">{dep.currency}</td>
                  <td className="p-3 truncate max-w-[150px]">{dep.address}</td>
                  <td
                    className={`p-3 font-semibold ${
                      dep.status === "Completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {dep.status}
                  </td>
                  <td className="p-3">
                    {new Date(dep.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Withdrawal History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>
        {withdrawalHistory.length === 0 ? (
          <p className="text-slate-400">No withdrawals yet.</p>
        ) : (
          <table className="w-full bg-[#0f274f] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#152d52]">
                <th className="p-3 text-left">Transaction ID</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalHistory.map((wd) => (
                <tr key={wd.id} className="border-t border-slate-700">
                  <td className="p-3 text-xs text-slate-400">{wd.id}</td>
                  <td className="p-3">${wd.amount}</td>
                  <td className="p-3">{wd.currency}</td>
                  <td className="p-3 truncate max-w-[150px]">{wd.address}</td>
                  <td
                    className={`p-3 font-semibold ${
                      wd.status === "Completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {wd.status}
                  </td>
                  <td className="p-3">
                    {new Date(wd.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
