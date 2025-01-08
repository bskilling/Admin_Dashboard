"use client";
import React, { useState } from "react";
import Protected from "../../hooks/useProtected";
import { BiSearch } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";
import Sidebar from "../../elements/Sidebar";
import CourseContent from "../../elements/CourseContent";

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
