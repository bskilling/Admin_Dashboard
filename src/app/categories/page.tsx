"use client";

import { useState } from "react";
import CreateCategory from "./_components/CreateCategory";
import Typess from "./_components/Typess";

export default function RouteComponent() {
  const [selectedType, setSelectedType] = useState<
    "b2b" | "b2c" | "b2g" | "b2i" | null
  >("b2c");
  return (
    <div className="w-full">
      <Typess selectedType={selectedType} setSelectedType={setSelectedType} />
      <CreateCategory selectedType={selectedType} />
    </div>
  );
}
