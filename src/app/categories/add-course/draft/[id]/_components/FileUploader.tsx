/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import axios from "axios";
import env from "@/lib/env";
import { toast } from "sonner";
import Image from "next/image";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";

interface FileUploaderProps {
  setFileId: (id: string | null) => void;
  title: string;
  purpose?: string;
  label?: string;
  setUrl?: (url: string | null) => void;
  url?: string;
  id?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  setFileId,
  title,
  label,
  purpose,
  setUrl,
  url,
  id,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(url || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", purpose ?? "default");
      formData.append("type", "image");

      const response = await axios.post(
        env.BACKEND_URL + "/api/files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { _id, viewUrl } = response.data.data;
      setFileId(_id);
      setPreviewUrl(viewUrl);
      if (setUrl) setUrl(viewUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Upload failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      await axios.delete(`${env.BACKEND_URL}/api/files/${id}`);
      setFileId(null);
      setPreviewUrl(null);
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Failed to delete file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 border rounded-lg flex flex-col items-center justify-center gap-3">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      {/* Upload Box */}
      <div
        className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <p className="text-gray-600">Uploading...</p>
        ) : previewUrl ? (
          <Image
            src={previewUrl}
            alt="Uploaded Preview"
            width={120}
            height={120}
            className="rounded-md object-cover"
          />
        ) : (
          <>
            <AiOutlineCloudUpload className="text-gray-500 w-10 h-10" />
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-xs text-gray-500">Click to upload</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".jpg,.png,.jpeg,.webp"
      />

      {/* Delete Button */}
      {previewUrl && (
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-700 transition"
        >
          <AiOutlineDelete className="w-4 h-4" /> Remove File
        </button>
      )}
    </div>
  );
};

export default FileUploader;
