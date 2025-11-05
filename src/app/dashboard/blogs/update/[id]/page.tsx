'use client';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useEditBlogMutation, useGetBlogByIdQuery } from '@/redux/features/blog/blogApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Protected from '@/app/hooks/useProtected';
import Image from 'next/image';
import { useUploadImageMutation } from '@/redux/features/upload/uploadApi';

export default function UpdateBlog({ params }: any) {
  const [formData, setFormData] = useState<any>();
  const router = useRouter();

  const { isLoading, data, refetch } = useGetBlogByIdQuery(params.id);
  const [editBlog, { isSuccess, error }] = useEditBlogMutation();
  const [
    uploadImage,
    { isLoading: uploadLoading, isSuccess: isUploadSuccess, error: uploadError },
  ] = useUploadImageMutation();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data?.blog);
    }
  }, [data]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await editBlog({
      id: params.id,
      data: formData,
    });
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: ['arial', 'comic-sans', 'georgia'] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'script', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video', 'code-block', 'formula'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Formats objects for setting up the Quill editor
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'align',
    'strike',
    'script',
    'blockquote',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'code-block',
  ];

  useEffect(() => {
    if (isSuccess) {
      toast.success('Blog updated successfully');
      router.replace(`/dashboard/blogs/${params.id}`);
    }
  }, [isSuccess, params.id, router]);

  const handleImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // setIsImageLoading(true);
      const file = files[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const data = await uploadImage(formData);
        setFormData((prev: any) => ({
          ...prev,
          banner: data.data.url,
        }));
        // setIsImageLoading(false);
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
        formData.append('file', file);

        const data = await uploadImage(formData);
        setFormData((prev: any) => ({
          ...prev,
          banner: data.data.url,
        }));
      }
    }
  };

  return (
    <Protected>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white px-8 pb-8 rounded-lg shadow-md max-w-3xl w-full">
          <h1 className="text-center text-3xl my-7 font-semibold text-gray-800">Edit Blog</h1>
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
                dragging ? 'bg-blue-500' : 'bg-transparent'
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              required
              value={formData?.title}
              id="title"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />

            <ReactQuill
              className="h-72 mb-12"
              theme="snow"
              value={formData?.content}
              onChange={value => {
                setFormData({ ...formData, content: value });
              }}
              placeholder={'Write something awesome...'}
              modules={modules}
              formats={formats}
            />

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-4 py-2 text-center rounded-md bg-sky-600 text-white w-[80px] hover:bg-sky-800 transform transition duration-500 hover:scale-105"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
}
