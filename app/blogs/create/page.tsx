"use client";

import React, { useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useCreateBlogMutation } from "@/redux/features/blog/blogApi";
import toast from "react-hot-toast";
import { getCookie } from "@/utils/AuthUser";
import Protected from "@/app/hooks/useProtected";
import { ThreeCircles } from "react-loader-spinner";
import { useUploadImageMutation } from "@/redux/features/upload/uploadApi";
import Image from "next/image";

type Props = {};

export default function Page({}: Props) {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [createBlog, { isLoading, isSuccess, error }] = useCreateBlogMutation();
  const [
    uploadImage,
    {
      isLoading: uploadLoading,
      isSuccess: isUploadSuccess,
      error: uploadError,
    },
  ] = useUploadImageMutation();
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const modules = {
    toolbar: [
      [
        { header: "1" },
        { header: "2" },
        { font: ["arial", "comic-sans", "georgia"] },
      ],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "script", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video", "code-block", "formula"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Formats objects for setting up the Quill editor
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
  ];

  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    content: "",
    banner: "",
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully");
    }
  }, [isSuccess]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const userData = JSON.parse(getCookie("user") as string);
    if (userData.id) {
      const updatedFormData = {
        ...formData,
        userId: userData?.id,
      };
      if (formData.title && formData?.content) {
        await createBlog(updatedFormData);
      } else {
        toast.error("please provide a title and content");
      }
    } else {
      toast.error("user not found, Login to access this section");
    }
  };

  const handleImageInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsImageLoading(true);
      const file = files[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const data = await uploadImage(formData);
        setFormData((prev) => ({
          ...prev,
          banner: data.data.url,
        }));
        setIsImageLoading(false);
      }
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = async (e: any) => {
    e.preventDefault();
    setDragging(false);

    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const data = await uploadImage(formData);
        setFormData((prev) => ({
          ...prev,
          banner: data.data.url,
        }));
        setIsImageLoading(false);
      }
    }
  };

  return (
    <Protected>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full">
          <h1 className="text-center text-3xl mx-7 py-2 font-semibold text-gray-800">
            Create a Post
          </h1>
          <div className="mb-6 border-dotted hover:cursor-pointer">
            <input
              type="file"
              accept="image/*"
              id="banner"
              className="hidden"
              onChange={handleImageInputChange}
            />
            <label
              htmlFor="banner"
              className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center hover:cursor-pointer ${
                dragging ? "bg-blue-500" : "bg-transparent"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {formData?.banner ? (
                <Image src={formData?.banner} alt="" width={400} height={300} />
              ) : (
                <span className="text-black dark:text-white border-dotted">
                  Drag and drop your thumbnail here or click to browse
                </span>
              )}
            </label>
          </div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              required
              id="title"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <ReactQuill
              theme="snow"
              className="h-72 mb-6"
              modules={modules}
              formats={formats}
              placeholder="Write something awesome..."
              value={formData.content}
              onChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
            />

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="px-6 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
              >
                {isLoading ? (
                  <ThreeCircles
                    visible={true}
                    height="20"
                    width="20"
                    color="#ffffff"
                    ariaLabel="three-circles-loading"
                  />
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
}
