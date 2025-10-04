"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

const WALLETS = [
  { name: "Bitcoin", symbol: "BTC", address: "bc1qexample123..." },
  { name: "Tether (ERC20)", symbol: "USDT", address: "0xusdtexample..." },
  { name: "Ethereum", symbol: "ETH", address: "0xethexample..." },
  { name: "Ripple", symbol: "XRP", address: "rpexxample..." },
  { name: "Solana", symbol: "SOL", address: "solana1example..." },
  { name: "Tether (BEP20)", symbol: "USDT-BSC", address: "bnb1example..." },
];

export default function AddFundsPage() {
  const [selected, setSelected] = useState<any | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const { user, updateBalances } = useAuth(); // ✅ add updateBalances
  const router = useRouter();

 const confirm = async () => {
   if (!selected) return alert("Choose a wallet");
   if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");
   if (!user) return alert("Not logged in");

   setLoading(true);
   try {
     const res = await fetch("/api/dashboard", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         user: user.email,
         amount: Number(amount),
         address: selected.address,
         currency: selected.symbol,
         type: "deposit", // ✅ required for deposits
       }),
     });

     const json = await res.json();
     if (res.ok) {
       updateBalances({
         mainBalance: (user.mainBalance || 0) + Number(amount),
         totalDeposit: (user.totalDeposit || 0) + Number(amount),
       });

       alert("Deposit submitted — pending confirmation");
       setAmount("");
       setSelected(null);
       router.push("/dashboard");
     } else {
       alert(json?.error || "Failed to deposit");
     }
   } catch (err) {
     console.error(err);
     alert("Error, check console");
   } finally {
     setLoading(false);
   }
 };


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#0b1130] text-slate-200">
        <h1 className="text-2xl font-semibold mb-6">Add Fund</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {WALLETS.map((w) => (
            <div
              key={w.symbol}
              className="bg-[#162446] p-6 rounded-xl flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded bg-slate-800 mb-4 flex items-center justify-center text-lg">
                {w.symbol}
              </div>
              <h3 className="font-semibold mb-1">{w.name}</h3>
              <button
                onClick={() => setSelected(w)}
                className="mt-3 bg-green-500 px-4 py-2 rounded text-black font-semibold"
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#0f2a57] p-6 rounded-xl w-96">
              <h2 className="text-lg font-bold mb-2">Send {selected.symbol}</h2>
              <p className="text-sm text-slate-300 mb-3">
                Send to this address:
              </p>
              <div className="bg-slate-800 p-3 rounded mb-4 break-all text-green-300">
                {selected.address}
              </div>

              <input
                type="number"
                placeholder="Enter USD amount"
                value={amount === "" ? "" : Number(amount).toString()}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full p-2 rounded bg-slate-800 mb-3 text-white"
              />

              <div className="flex gap-3">
                <button
                  onClick={confirm}
                  disabled={loading}
                  className="flex-1 bg-green-500 py-2 rounded"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 bg-red-500 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
