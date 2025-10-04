// components/StatCard.tsx
import React from "react";

export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#0f274f] p-6 rounded-xl flex flex-col items-start shadow">
      <div className="text-2xl mb-3 text-green-400">{icon}</div>
      <h3 className="text-slate-300 text-sm">{title}</h3>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
