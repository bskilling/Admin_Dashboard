"use client";

import React, { Suspense } from "react";
import { IoIosAdd } from "react-icons/io";
import { FaFilter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  return (
    <Suspense>
      <div className="flex h-screen w-full">
        {/* Sidebar */}

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Navbar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <IoIosAdd size={22} /> Add Course
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                <FaFilter size={20} /> Filters
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-3 gap-6"
          >
            <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold">Total Students</h3>
              <p className="text-3xl font-bold">1,250</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold">Courses</h3>
              <p className="text-3xl font-bold">75</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold">Instructors</h3>
              <p className="text-3xl font-bold">25</p>
            </div>
          </motion.div>
        </main>

        <Button
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </div>
    </Suspense>
  );
}
