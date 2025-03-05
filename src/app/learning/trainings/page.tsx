"use client";
import React, { useState } from "react";
import Protected from "../../hooks/useProtected";
import { BiSearch } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";
import Sidebar from "../../_components/Sidebar";
import CourseContent from "../../_components/CourseContent";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Protected>
      <div className="h-screen w-full">
        {/* <Sidebar /> */}
        <CourseContent />
      </div>
    </Protected>
  );
};

export default Page;
