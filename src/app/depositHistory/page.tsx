// app/depositHistory/page.tsx
"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/context/AuthContext";

export default function DepositHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);

  async function fetchHistory() {
    if (!user) return;
    try {
      const res = await fetch(`/api/depositHistory?user=${user.email}`);
      const json = await res.json();
      setHistory(json.depositHistory || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  }

  useEffect(() => {
    fetchHistory();
    const t = setInterval(fetchHistory, 4000);
    return () => clearInterval(t);
  }, [user]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#0b1130] text-slate-200">
        <h1 className="text-3xl font-semibold mb-6">Deposit History</h1>
        {history.length === 0 ? (
          <p className="text-slate-400">No deposits yet.</p>
        ) : (
          <div className="bg-slate-800/50 p-4 rounded">
            {history.map((d) => (
              <div
                key={d.id}
                className="flex justify-between text-sm text-slate-300 border-b border-slate-600/30 py-2"
              >
                <div>
                  ${d.amount.toFixed(2)} — {d.currency} — {d.address}
                </div>
                <div>
                  {d.status} • {new Date(d.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
