// app/investmentPlans/page.tsx
"use client";
import { useAuth } from "@/components/context/AuthContext";
import Sidebar from "@/components/Sidebar";

const plans = [
  { id: 1, name: "Starter Plan", roi: "5%", duration: "7 Days", min: 50 },
  { id: 2, name: "Pro Plan", roi: "10%", duration: "14 Days", min: 200 },
  { id: 3, name: "Elite Plan", roi: "15%", duration: "30 Days", min: 500 },
];

export default function InvestmentPlansPage() {
  const { user } = useAuth();

  async function invest(plan: any) {
    try {
      const res = await fetch("/api/investmentPlans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "invest",
          planId: plan.id,
          amount: plan.min,
          user: user?.email,
        }),
      });
      const json = await res.json();
      console.log("Investment started:", json);
    } catch (err) {
      console.error("Investment failed", err);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#0b1130] text-slate-200">
        <h1 className="text-3xl font-semibold mb-6">Investment Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.id} className="bg-slate-800/50 p-6 rounded text-center">
              <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
              <p className="text-slate-400 mb-2">ROI: {p.roi}</p>
              <p className="text-slate-400 mb-4">Duration: {p.duration}</p>
              <p className="text-slate-300 mb-4">Min Invest: ${p.min}</p>
              <button
                onClick={() => invest(p)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
              >
                Invest
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
