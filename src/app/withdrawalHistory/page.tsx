"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/context/AuthContext";

interface Withdrawal {
  id: number;
  amount: number;
  address: string;
  currency: string;
  status: string;
  createdAt: string;
}

export default function WithdrawalHistory() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/withdrawalHistory?user=${user.email}`);
        const data = await res.json();
        if (res.ok) {
          // Combine pending + history
          const all = [
            ...(data.pendingWithdrawals || []),
            ...(data.withdrawalHistory || []),
          ];
          setWithdrawals(all);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#0b1130] text-slate-200">
        <h1 className="text-2xl font-semibold mb-6">Withdrawal History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-slate-400">No withdrawals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-700 rounded-lg">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Currency</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-right">Amount (USD)</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-t border-slate-700">
                    <td className="px-4 py-2">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{w.currency}</td>
                    <td className="px-4 py-2 break-all">{w.address}</td>
                    <td className="px-4 py-2 text-right">${w.amount}</td>
                    <td
                      className={`px-4 py-2 text-center font-semibold ${
                        w.status === "Completed"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {w.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
