/* eslint-disable @next/next/no-img-element */
"use client";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";
import { Input } from "@/components/ui/input";
import { LuRadioTower } from "react-icons/lu";
import { BiSolidCertification } from "react-icons/bi";
import { Clock } from "lucide-react";

export default function CertificationSection({
  register,
}: {
  register: UseFormReturn<TDraftCourseForm>["register"];
}) {
  return (
    <section className="relative z-[40]  w-[85vw] mx-auto bg-white shadow-lg rounded-2xl p-10 flex flex-col gap-8 border border-gray-200">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
        <BiSolidCertification className="w-8 h-8 text-[#00C6FF]" />
        Certification Details
      </h2>

      {/* Content Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration Section */}
        <div className="flex items-center gap-4 bg-gray-100 p-5 rounded-xl shadow-md border border-gray-300">
          <Clock className="w-7 h-7 text-[#00C6FF]" />
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Duration</p>
            <Input
              type="number"
              {...register("durationHours")}
              placeholder="Enter hours"
              className="w-full mt-2 bg-white border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-[#00C6FF] rounded-lg p-2"
            />
          </div>
        </div>

        {/* Course Mode Section */}
        <div className="flex items-center gap-4 bg-gray-100 p-5 rounded-xl shadow-md border border-gray-300">
          <LuRadioTower className="w-7 h-7 text-[#00C6FF]" />
          <div>
            <p className="font-semibold text-gray-800">Course Mode</p>
            <p className="text-gray-600">Online & Offline</p>
          </div>
        </div>

        {/* Certification Section */}
        <div className="bg-gray-100 p-5 rounded-xl shadow-md border border-gray-300">
          <p className="font-semibold text-gray-800 flex items-center gap-2">
            <BiSolidCertification className="w-7 h-7 text-[#00C6FF]" />
            Certification Title
          </p>
          <Input
            type="text"
            {...register("certification.title")}
            placeholder="Enter certification title"
            className="w-full mt-2 bg-white border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-[#00C6FF] rounded-lg p-2"
          />
          <img
            src="/assets/certificate.png"
            className="w-full max-h-40 object-contain mt-4 rounded-lg shadow-md border border-gray-300"
            alt="Certificate"
          />
        </div>
      </div>
    </section>
  );
}
