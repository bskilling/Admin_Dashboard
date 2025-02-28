"use client";

import FileUploader from "@/src/components/global/FileUploader";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";

export const heroVariants = [
  "bg-gradient-to-r from-[#1E3C72] via-[#2A5298] to-[#1E3C72]", // Ocean Breeze
  "bg-gradient-to-r from-[#004E92] via-[#0F9B8E] to-[#004E92]", // Sleek Teal
  "bg-gradient-to-r from-[#232526] via-[#414345] to-[#232526]", // Dark Mode
  "bg-gradient-to-r from-[#3A1C71] via-[#D76D77] to-[#FFAF7B]", // Royal Sunset
  "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]", // Deep Space
  // new gradients
  "bg-gradient-to-r from-[#1E3C72] via-[#2A5298] to-[#1E3C72]", // Ocean Breeze
  "bg-gradient-to-r from-[#FF5F6D] via-[#FFC371] to-[#FF7E5F]", // Sunset Glow
  "bg-gradient-to-r from-[#2E3192] via-[#1BFFFF] to-[#00A3E1]", // Ocean Breeze
  "bg-gradient-to-r from-[#004E92] via-[#0F9B8E] to-[#004E92]", // sleak mordern  teal
  "bg-gradient-to-r from-[#11998E] via-[#38EF7D] to-[#1E9600]", // Forest Vibes
  "bg-gradient-to-r from-[#41295A] via-[#2F0743] to-[#753A88]", // Midnight Purple
];
export default function HeroSection({
  watch,
  formState,
  register,
  setValue,
  bannerUrl,
  setBannerUrl,
  variants: variant,
}: {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  register: UseFormReturn<TDraftCourseForm>["register"];
  formState: UseFormReturn<TDraftCourseForm>["formState"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
  bannerUrl: string;
  setBannerUrl: (url: string) => void;
  variants: number;
}) {
  return (
    <section
      id="hero"
      className={cn(
        "relative w-full min-h-[600px] bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] flex justify-center items-center overflow-hidden",
        variant === 0 ? heroVariants[0] : "",
        variant === 1 ? heroVariants[1] : "",
        variant === 2 ? heroVariants[2] : "",
        variant === 3 ? heroVariants[3] : "",
        variant === 4 ? heroVariants[4] : "",
        variant === 5 ? heroVariants[5] : "",
        variant === 6 ? heroVariants[6] : "",
        variant === 7 ? heroVariants[7] : "",
        variant === 8 ? heroVariants[8] : "",
        variant === 9 ? heroVariants[9] : "",
        variant === 10 ? heroVariants[10] : ""
      )}
    >
      {/* Decorative Background Elements */}
      {/* <div className="absolute -top-10 left-10 w-40 h-40 bg-[#FFD166] rounded-full opacity-40"></div> */}
      <div className="absolute -bottom-10 right-10 w-32 h-32 bg-[#06D6A0] rounded-full opacity-40"></div>
      {/* <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-[#118AB2] rounded-full opacity-50"></div> */}
      <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-[#EF476F] rounded-full opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto grid md:grid-cols-2 gap-10 w-[80vw] py-14">
        {/* Left Column: Course Details */}
        <div className="space-y-5 text-[#FCEFEF]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            {/* {title} */}
            <Input
              {...register("title")}
              label="Course Title"
              placeholder="Enter Course Title"
              error={formState.errors.title?.message}
              className="!text-4xl border-0 border-b  w-fit  border-gray-500 rounded-none"
            />
          </h1>
          <Input
            {...register("slug")}
            label="Course Slug"
            placeholder="Enter course slug"
            error={formState.errors.slug?.message}
            className="border-0 border-b border-gray-500 rounded-none w-fit"
          />
          <p className="text-lg text-[#E5E5E5]">
            {" "}
            <Textarea
              {...register("description")}
              label="Description"
              placeholder="Course description"
              error={formState.errors.description?.message}
              className="!w-full !text-lg border-0 border-b   border-gray-500 rounded-none"
            />
          </p>
          <p className="text-lg font-semibold text-[#FFD166] flex gap-x-5 items-center">
            Enrollment Closes:{" "}
            <span className="text-[#06D6A0]">
              <Input
                type="date"
                className="border-0 border-b rounded-none "
                value={
                  watch("endTime")
                    ? // @ts-expect-error error
                      new Date(watch("endTime"))?.toISOString().slice(0, 10) ??
                      new Date().toISOString().slice(0, 10)
                    : undefined
                }
                onChange={(e) => setValue("endTime", new Date(e.target.value))}
                // label="End Date"
                error={formState.errors.endTime?.message}
              />
              {/* {format(new Date(endTime), "dd MMM, yyyy")} */}
            </span>
          </p>

          {/* {highlights && highlights.length > 0 && (
          <div className="space-y-2">
            {highlights.map((hl, index) => (
              <p
                key={index}
                className="text-lg flex items-center gap-x-3 text-[#E5E5E5]"
              >
                <IoIosCheckbox className="w-6 h-6 text-[#06D6A0]" /> {hl}
              </p>
            ))}
          </div>
        )} */}
          {/* 
          <div className="flex gap-5 mt-5">
            <Button className="bg-white text-[#118AB2] px-6 py-2 rounded-lg font-semibold hover:bg-[#FFD166] transition">
              Apply Now
            </Button>
            <Button className="border-none bg-[#118AB2] border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#FFD166] hover:text-[#118AB2] transition">
              Get Syllabus
            </Button>
          </div> */}
        </div>

        <div className="relative w-full px-10 py-10 rounded-md  justify-center bg-card">
          {/* <h2 className="text-xl font-bold">⚡ Banner Image</h2> */}

          <FileUploader
            label="Banner Image"
            purpose="course-banner"
            title="Banner Image"
            url={bannerUrl}
            id={watch("banner")}
            setFileId={(fileId) => setValue("banner", fileId as string)}
            setUrl={(url) => setBannerUrl(url as string)}
          />
        </div>

        {/* Right Column: Course Banner Image */}
        {/* <div className="relative w-full flex justify-center">
              <Image
                width={600}
                height={600}
                src={bannerImage}
                alt="Course Banner"
                className="w-full max-h-80 rounded-lg object-cover"
              />
            </div> */}
      </div>
    </section>
  );
}
