
import React from "react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import image1 from "@/app/assets/home/card/cardmg.png";
import image2 from "@/app/assets/home/card/cardimg2.png";
interface HomeCardProps {
  id: number;
  title: string;
  description: string;
  image: any; 
  list: {
      label: string;
      desc?:string
    icon?: React.ReactNode;
  }[];
  button?: {
      label: string;
      
    icon: React.ReactNode;
  };
}

const cardData: HomeCardProps[] = [
  {
    id: 1,
    title: "The future of finance",
    description:
      "User-friendly solutions to help investors of all levels achieve financial success",
    image:image1,
    list: [
      { label: "Lowest fees in market", icon: <FaCheck /> },
      { label: "Fast and Secure transactions", icon: <FaCheck /> },
      { label: "256-bit secure encryption", icon: <FaCheck /> },
    ],
    button: { label: "Get Started", icon: <FaCheck /> },
  },
  {
    id: 2,
    title: "Expertise You Can Trust",
    description:
      "User-friendly solutions to help investors of all levels achieve financial success",
    image: image2,
    list: [
      { label: "20+",desc:"Countries"  },
      { label: "$4.75M",desc:"Transactions" },
        { label: "1500+", desc: "Active users" },
      {label: "6+", desc: "Cryptos Supported"}
    ],
  },
];

function HomeCard() {
  return (
    <div className="space-y-20 py-10">
      {cardData.map((card, index) => (
        <div
          key={card.id}
          className="grid pl-70 grid-cols-1 md:grid-cols-2 items-center"
        >
          <div
            className={`bg-[#14182b] rounded-4xl w-[80%] py-16 ${
              index % 2 !== 0 ? "md:order-2" : "md:order-1"
            }`}
          >
            <Image
              src={card.image}
              alt={card.title}
              className="rounded-lg m-auto"
              width={400}
              height={300}
            />
          </div>

          <div
            className={`space-y-7 w-[70%] ${
              index % 2 !== 0 ? "md:order-1" : "md:order-2"
            }`}
          >
            <h2 className="text-5xl font-bold">{card.title}</h2>
            <p className="text-gray-600">{card.description}</p>

            {card.id === 2 ? (
              <div className="grid grid-cols-2 gap-6 border-t border-gray-700 pt-6">
                {card.list.map((item, i) => (
                  <div key={i} className="text-white">
                    <p className="text-2xl font-bold">{item.label}</p>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {card.list.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white">
                    {item.icon}
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            )}

            {card.button && (
              <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {card.button.icon}
                {card.button.label}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomeCard;
