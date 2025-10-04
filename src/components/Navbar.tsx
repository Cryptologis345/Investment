"use client"
import Image from 'next/image';
import React from 'react'
import logo from "@/app/assets/navbar/Tradelogo.png"
import { useRouter } from 'next/navigation';

function Navbar()
{
    const router = useRouter();
  return (
    <div className="p-14 ">
      <div className="bg-[#14182b] w-[170vh] m-auto text-white flex justify-evenly rounded-full items-center p-5">
        <div>
          <Image src={logo} alt="" />
        </div>
        <ul className="flex justify-evenly items-center space-x-16  font-normal">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        <div>
          <button
            onClick={() => router.push("/screens/auth/Signin")}
            className="bg-white text-black px-4 py-2 rounded-md m-2 cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar
