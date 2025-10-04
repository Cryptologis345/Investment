// components/ProgressCard.tsx
import React from "react";

export default function ProgressCircle({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-slate-700"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-green-400"
            strokeWidth="3"
            strokeDasharray={`${percent}, 100`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
          {percent}%
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">{label}</p>
    </div>
  );
}
