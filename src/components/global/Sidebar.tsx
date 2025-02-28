import Link from "next/link";
import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategoryAlt, BiLogOut } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineLibraryBooks } from "react-icons/md";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col shadow-lg">
      <h2 className="text-2xl font-bold mb-6">EdTech Admin</h2>
      <nav className="flex flex-col gap-4 text-lg">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all"
        >
          <AiOutlineDashboard size={22} /> Dashboard
        </Link>
        <Link
          href="/learning/trainings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all"
        >
          <BiCategoryAlt size={22} /> Old Trainings
        </Link>
        <Link
          href="/categories"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all"
        >
          <MdOutlineLibraryBooks size={22} /> New Courses
        </Link>
        <Link
          href="/students"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-all"
        >
          <HiOutlineUserGroup size={22} /> Students
        </Link>
      </nav>
      <button className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all">
        <BiLogOut size={22} /> Logout
      </button>
    </aside>
  );
}
