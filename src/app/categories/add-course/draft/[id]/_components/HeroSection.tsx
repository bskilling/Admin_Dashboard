/* eslint-disable @next/next/no-img-element */
"use client";

import FileUploader from "@/components/global/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";
import { motion } from "framer-motion";

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
        "relative w-full  flex justify-center items-center overflow-hidden transition-all duration-500",
        "bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364]" // Deep Blue Ocean
      )}
    >
      {/* Animated Background Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Content Box */}
      <motion.div
        className="relative z-10 mx-auto grid md:grid-cols-2 gap-10 w-[80vw] py-14 px-8 rounded-2xl bg-white backdrop-blur-lg shadow-xl border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Left Column: Course Details */}
        <div className="space-y-5 ">
          <h1 className="text-3xl font-bold ">Create Your Course</h1>
          <Input
            {...register("title")}
            label="Course Title"
            placeholder="Enter Course Title"
            error={formState.errors.title?.message}
            className="border border-[#00C6FF] focus:ring-[#00C6FF] focus:border-[#00C6FF]"
          />
          <Input
            {...register("slug")}
            label="Course Slug"
            placeholder="Enter course slug"
            error={formState.errors.slug?.message}
            className="border border-[#00C6FF] focus:ring-[#00C6FF] focus:border-[#00C6FF]"
          />
          <Textarea
            {...register("description")}
            label="Description"
            placeholder="Course description"
            error={formState.errors.description?.message}
            className="border border-[#00C6FF] focus:ring-[#00C6FF] focus:border-[#00C6FF]"
          />
        </div>

        {/* Right Column: Banner Image */}
        <div className="relative w-full px-6 py-6 rounded-lg bg-black/20 backdrop-blur-md flex flex-col items-center justify-center">
          <FileUploader
            label="Banner Image"
            purpose="course-banner"
            title="Upload Banner Image"
            url={bannerUrl}
            id={watch("banner")}
            setFileId={(fileId) => setValue("banner", fileId as string)}
            setUrl={(url) => setBannerUrl(url as string)}
          />
        </div>
      </motion.div>
    </section>
  );
}
