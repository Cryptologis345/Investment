"use client";
import React from "react";
import { FaCheck } from "react-icons/fa";

interface plansCardProps {
  id: number;
  title: string;
  price: string;
  list: {
    label: string;
    icon?: React.ReactNode;
  }[];
  btn: string;
}

const plansCard: plansCardProps[] = [
  {
    id: 1,
    title: "Mining",
    price: "$1,000 - $4,999",
    list: [
      { label: "5% ROI", icon: <FaCheck /> },
      { label: "24 Hours", icon: <FaCheck /> },
      { label: "Interest + Capital", icon: <FaCheck /> },
    ],
    btn: "Invest Now",
  },
  {
    id: 2,
    title: "Premium",
    price: "$5,000 - $9,999",
    list: [
      { label: "50% ROI", icon: <FaCheck /> },
      { label: "10 Days", icon: <FaCheck /> },
      { label: "Interest + Capital", icon: <FaCheck /> },
    ],
    btn: "Invest Now",
  },
  {
    id: 3,
    title: "Gold",
    price: "$10,000 - $1,000,000",
    list: [
      { label: "100% ROI", icon: <FaCheck /> },
      { label: "14 Days", icon: <FaCheck /> },
      { label: "Interest + Capital", icon: <FaCheck /> },
    ],
    btn: "Invest Now",
  },
];

function Plans() {
  return (
    <div className="bg-[#0B0D17] py-20 px-5 text-white">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Investment Plans</h1>
        <p className="text-gray-400">
          Experience secure, stress-free investing where risk is mitigated, and
          profit
          <br /> maximization is a reality.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plansCard.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-8 shadow-lg relative ${
              plan.id === 2
                ? "bg-gradient-to-b from-[#1a1a40] to-[#000000] border border-blue-700 scale-105"
                : "bg-[#141622]"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">{plan.title}</h2>
            <p className="text-xl font-medium mb-6">{plan.price}</p>
            <ul className="space-y-4 mb-6">
              {plan.list.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <span className="text-green-500">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`w-full py-3 rounded-full font-medium transition ${
                plan.id === 2
                  ? "bg-white text-black hover:bg-gray-200"
                  : "border border-gray-500 hover:bg-gray-700"
              }`}
            >
              {plan.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Plans;
