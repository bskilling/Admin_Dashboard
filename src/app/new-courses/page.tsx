"use client";
import React, { useState } from "react";
import Typess from "./_components/Typess";

export default function RouteComponent() {
  const [selectedType, setSelectedType] = useState<
    "b2b" | "b2c" | "b2g" | "b2i" | null
  >(null);
  return (
    <div className="w-full">
      <Typess selectedType={selectedType} setSelectedType={setSelectedType} />
      {/* <CreateCategory /> */}
    </div>
  );
}
