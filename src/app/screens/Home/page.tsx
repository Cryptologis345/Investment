"use client"
import Navbar from "@/components/Navbar";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import Image from "next/image";
import image3 from "@/app/assets/home/card/cardmg.png";
import image1 from "@/app/assets/home/laptop.png";
import image2 from "@/app/assets/home/phone.png";
import HomeCard from "@/components/HomeCard";
import Plans from "@/components/Plans";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Home()
{
  const router = useRouter()
  return (
    <div className="bg-[#0F1014]">
      <div className="  bg-gradient-to-tr from-[#0F1014] via-[#0F1014] to-[#0F1014] overflow-hidden ">
        <section>
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen blur-2xl opacity-40 animate-ping"></div>

          <div className="relative z-30">
            <div>
              <Navbar />
            </div>
            <div className="text-center space-y-7">
              <div>
                <h1 className="text-7xl font-normal">Trades Global FX</h1>
              </div>
              <div>
                <p className="text-lg">
                  Unlock the potential of your brand new future with Trades
                  Global FX.
                  <br /> Take control of your financial destiny and embark on a
                  journey towards prosperity and success. <br />
                </p>
              </div>
              <div className="flex items-center m-auto justify-center space-x-4">
                <Link href="/screens/auth/Signin">
                  <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full  cursor-pointer">
                    Login <FaLongArrowAltRight />
                  </button>
                </Link>
                <button onClick={() => router.push("/screens/auth/Signup")} className="outline-1 rounded-full text-white px-4 py-2 ">
                  Sign Up
                </button>
              </div>
            </div>
            <div className=" relative w-full z-30 -bottom-30">
              <div className="relative left-40 ">
                <div>
                  <Image src={image1} className="w-[70%]" alt="Laptop" />
                </div>
                <div className="absolute right-89 bottom-0 ">
                  <Image src={image2} className="w-[90%] " alt="Phone" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="z-10 relative bg-[#0F1014] py-50 ">
          <HomeCard />
        </section>
      </div>
      <section className="space-y-10">
        <div className="text-center">
          <h1 className="text-6xl ">
            We are empowering traders
            <br /> globally
          </h1>
        </div>
        <div>
          <div className="px-50">
            <div className="flex bg-[#14182b] rounded-2xl px-20 pt-14 items-center">
              <div>
                <Image src={image3} className="w-[200vw]" alt="" />
              </div>
              <div className="px-20">
                <p className="">
                  Trades Global FX Funding was established in 2021 with the goal
                  of revolutionizing the trader payout model. It was founded out
                  of dissatisfaction with existing funding companies and a
                  desire to adopt a more customer-centric approach. As a premier
                  trader funding company, Trades Global FX Funding outperforms
                  other futures funding evaluation firms in terms of payouts.
                  With a vast global community spanning over 150 countries and
                  tens of thousands of members, Trades Global FX Funding,
                  headquartered in Austin, Texas, specializes in funding
                  evaluations for futures markets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Plans />
      </section>
    </div>
  );
}

export default Home;
