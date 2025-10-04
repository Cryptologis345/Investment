"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import ProgressCircle from "@/components/ProgressCard";
import {
  FaWallet,
  FaPiggyBank,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

type DashboardData = {
  mainBalance: number;
  interestBalance: number;
  totalDeposit: number;
  totalEarn: number;
  stats: {
    investCompleted: number;
    roiSpeed: number;
    roiRedeemed: number;
  };
  pendingDeposits: any[];
  depositHistory: any[];
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const router = useRouter();

  async function fetchData() {
    if (!user) return;
    try {
      const res = await fetch(
        `/api/dashboard?user=${encodeURIComponent(user.email)}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/screens/auth/Signin"); 
      return;
    }

    fetchData();
    const t = setInterval(fetchData, 4000);
    return () => clearInterval(t);
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1130] text-white">
        Redirecting to sign in...
      </div>
    );
  }

  if (!data) return <div className="p-6 text-white">Loading dashboard...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-[#0b1130] text-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <button
            onClick={() => {
              logout();
              router.push("/signin");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* ✅ Top Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Main Balance"
            value={`$${Number(data.mainBalance || 0).toFixed(2)}`}
            icon={<FaWallet />}
          />
          <StatCard
            title="Interest Balance"
            value={`$${Number(data.interestBalance || 0).toFixed(2)}`}
            icon={<FaPiggyBank />}
          />
          <StatCard
            title="Total Deposit"
            value={`$${Number(data.totalDeposit || 0).toFixed(2)}`}
            icon={<FaDollarSign />}
          />
          <StatCard
            title="Total Earn"
            value={`$${Number(data.totalEarn || 0).toFixed(2)}`}
            icon={<FaChartLine />}
          />
        </section>

        {/* ✅ ROI Progress Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f274f] p-6 rounded-xl min-h-[260px] flex items-center justify-center">
            <p className="text-slate-400">[Monthly chart placeholder]</p>
          </div>

          <div className="bg-[#0f274f] p-6 rounded-xl flex flex-col items-center justify-center">
            <div className="flex gap-8">
              <ProgressCircle
                label="Invest Completed"
                percent={data.stats?.investCompleted || 0}
              />
              <ProgressCircle
                label="ROI Speed"
                percent={data.stats?.roiSpeed || 0}
              />
              <ProgressCircle
                label="ROI Redeemed"
                percent={data.stats?.roiRedeemed || 0}
              />
            </div>
          </div>
        </section>

        {/* ✅ Pending Deposits */}
        {data.pendingDeposits?.length > 0 && (
          <div className="mt-8 bg-yellow-500/10 p-4 rounded">
            <h3 className="font-semibold text-yellow-200 mb-2">
              Pending Deposits
            </h3>
            {data.pendingDeposits.map((p: any) => (
              <div
                key={p.id}
                className="flex justify-between text-sm text-yellow-100 border-b border-yellow-200/10 py-2"
              >
                <div>
                  ${Number(p.amount || 0).toFixed(2)} — {p.currency} —{" "}
                  {p.address}
                </div>
                <div>
                  {p.status} • {new Date(p.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Deposit History */}
        {data.depositHistory?.length > 0 && (
          <div className="mt-8 bg-slate-800/50 p-4 rounded">
            <h3 className="font-semibold text-slate-200 mb-2">
              Deposit History
            </h3>
            {data.depositHistory.map((d: any) => (
              <div
                key={d.id}
                className="flex justify-between text-sm text-slate-300 border-b border-slate-600/30 py-2"
              >
                <div>
                  ${Number(d.amount || 0).toFixed(2)} — {d.currency} —{" "}
                  {d.address}
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
