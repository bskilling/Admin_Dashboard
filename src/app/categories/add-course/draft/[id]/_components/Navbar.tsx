"use client";

import { cn } from "@/src/lib/utils";
import React from "react";
import { Link } from "react-scroll";

export default function Navbar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: any;
}) {
  return (
    <div className="hidden md:flex items-center space-x-8 sticky top-0 z-[100] bg-card py-10 pb-3 pl-5">
      <Link
        to="hero"
        spy={true}
        smooth={true}
        onClick={() => {
          setActiveTab("home");
        }}
        className={cn(
          "cursor-pointer text-gray-600 hover:text-blue-600",
          activeTab === "home" &&
            "text-blue-500 font-bold border-b border-blue-500"
        )}
      >
        Home
      </Link>
      <Link
        to="overview"
        smooth={true}
        onClick={() => {
          setActiveTab("overview");
        }}
        className={cn(
          "cursor-pointer text-gray-600 hover:text-blue-600",
          activeTab === "overview" && "text-blue-600 font-bold"
        )}
      >
        Overview
      </Link>
      <Link
        to="curriculum"
        smooth={true}
        onClick={() => {
          setActiveTab("curriculum");
        }}
        className={cn(
          "cursor-pointer text-gray-600 hover:text-blue-600",
          activeTab === "curriculum" && "text-blue-600 font-bold"
        )}
      >
        Curriculum
      </Link>
      {
        // @ts-expect-error error
        watch("skills") && watch("skills")?.length > 0 && (
          <Link
            to="skills"
            smooth={true}
            className={cn(
              "cursor-pointer text-gray-600 hover:text-blue-600",
              activeTab === "skills" && "text-blue-600 font-bold"
            )}
            onClick={() => {
              setActiveTab("skills");
            }}
          >
            Skills
          </Link>
        )
      }
      <Link
        to="why-join"
        smooth={true}
        onClick={() => {
          setActiveTab("why-join");
        }}
        className={cn(
          "cursor-pointer text-gray-600 hover:text-blue-600",
          activeTab === "why-join" && "text-blue-600 font-bold"
        )}
      >
        Why Join
      </Link>
      <Link
        to="faqs"
        spy={true}
        onClick={() => {
          setActiveTab("faqs");
        }}
        smooth={true}
        className={cn(
          "cursor-pointer text-gray-600 hover:text-blue-600",
          activeTab === "faqs" && "text-blue-600 font-bold"
        )}
      >
        FAQs
      </Link>
      <Link
        to="pricing"
        smooth={true}
        onClick={() => {
          setActiveTab("pricing");
        }}
        className={cn(
          "cursor-pointer text-gray-600 hover:text-blue-600",
          activeTab === "pricing" && "text-blue-600 font-bold"
        )}
      >
        Pricing
      </Link>
    </div>
  );
}
