"use client";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ImYoutube } from "react-icons/im";
import { TDraftCourseForm } from "../page";
import FileUploader from "./FileUploader";
// import FileUploader from "@/components/global/FileUploader";

export default function MediaUploadSection({
  register,
  watch,
  setValue,
  setLogoUrl,
  setPreviewImage,
  logoUrl,
  previewImage,
}: {
  register: UseFormReturn<TDraftCourseForm>["register"];
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
  setLogoUrl: (url: string) => void;
  setPreviewImage: (url: string) => void;
  logoUrl: string;
  previewImage: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-md space-y-6 m-6">
      <h2 className="text-2xl font-semibold text-gray-800">Media & Branding</h2>

      {/* YouTube Video Section */}
      <div className="bg-gray-100 p-5 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <ImYoutube className="text-red-600 w-6 h-6" /> YouTube Preview
        </h3>
        {watch("videoUrl") && (
          <iframe
            className="w-full aspect-video rounded-lg border"
            src={watch("videoUrl")}
            allowFullScreen
          />
        )}
        <Input
          {...register("videoUrl")}
          placeholder="Enter YouTube Video URL"
          className="mt-2"
        />
      </div>

      {/* Upload Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Course Logo */}
        <FileUploader
          label="Course Logo"
          title="Upload Course Logo"
          purpose="course-logo"
          setFileId={(fileId) => setValue("logoUrl", fileId as string)}
          id={watch("logoUrl")}
          // @ts-ignore
          setUrl={setLogoUrl}
          url={logoUrl}
        />

        {/* Preview Image */}
        <FileUploader
          label="Preview Image"
          title="Upload Preview Image"
          purpose="course-preview"
          setFileId={(fileId) => setValue("previewImage", fileId as string)}
          id={watch("previewImage")}
          // @ts-ignore
          setUrl={setPreviewImage}
          url={previewImage}
        />
      </div>
    </div>
  );
}
