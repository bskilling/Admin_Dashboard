/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import axios from "axios";
import env from "@/lib/env";
import { toast } from "sonner";
import Image from "next/image";

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
  const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(
    url ? url : null
  );
  const [fileId, setInternalFileId] = useState<string | null | undefined>(
    id ? id : null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || fileId) return; // Prevent new upload if a file is already uploaded

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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { _id, viewUrl } = response.data.data;
      setFileId(_id);
      setInternalFileId(_id);
      setPreviewUrl(viewUrl);
      if (setUrl) setUrl(viewUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!fileId) return;

    try {
      setIsLoading(true);
      await axios.delete(`${env.BACKEND_URL}/api/files/${fileId}`);
      setFileId(null);
      setInternalFileId(null);
      setPreviewUrl(null);

      // Clear file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (fileId) return; // Prevent drop if a file is already uploaded

    const file = event.dataTransfer.files?.[0];
    if (file) {
      const input = document.createElement("input");
      input.type = "file";
      input.files = event.dataTransfer.files;
      handleFileChange({
        target: input,
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}
      <div
        className="file-uploader w-full"
        onClick={() => !fileId && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: !fileId && !previewUrl ? "2px dashed #ccc" : "none",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          cursor: fileId ? "default" : "pointer",
          position: "relative",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.png,.jpeg,.webp,.docx"
          disabled={!!fileId}
        />
        {isLoading ? (
          <div className="loader">Processing...</div>
        ) : previewUrl ? (
          <div>
            <Image
              src={previewUrl}
              alt="Uploaded file preview"
              style={{ maxWidth: "100%", borderRadius: "5px" }}
              className="m-auto h-full w-full object-cover"
              width={200}
              height={200}
            />
            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                className="mt-2  text-white px-4 py-2 rounded-md bg-blue-500"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/8136/8136031.png"
              alt=""
              className="text-center m-auto h-20 w-20 object-cover"
            />
            <p className="mt-5 text-xl font-bold">{title}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploader;
