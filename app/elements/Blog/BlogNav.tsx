"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import loginPageLogo from "../../../public/assets/loginPageLogo.png";
import { LiaEdit } from "react-icons/lia";

export default function BlogNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200) {
        // Adjust the threshold as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-[50]  ${
        scrolled ? "bg-white" : ""
      } bg-opacity-30 bg-gray-200 backdrop-filter backdrop-blur-lg h-[80px] flex justify-between items-center px-6 w-screen`}
    >
      <div>
        <Link
          href="/learning/trainings"
          className="flex gap-2 items-center text-xl"
        >
          <Image src={loginPageLogo} alt="logo" width="120" height="120" />
        </Link>
      </div>

      <Link
        href="/blogs/create"
        className="p-3 flex justify-center items-center"
      >
        <LiaEdit size={40} className="text-gray-400" />

        <p className="text-gray-600">Write</p>
      </Link>
    </header>
  );
}
