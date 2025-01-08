import { formatToStringDate } from "@/utils/formatter";
import CoverImage from "./CoverImage";
import BlogTitle from "./BlogTitle";
import Avatar from "./Avatar";
import { RiEdit2Line } from "react-icons/ri";
import Link from "next/link";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDeleteBlogMutation } from "@/redux/features/blog/blogApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface BlogHeaderProps {
  id: string;
  title: string;
  coverImage: any;
  date: Date;
  slug: string;
  contentLength: number;
}

export default function BlogHeader({
  id,
  title,
  coverImage,
  date,
  slug,
  contentLength,
}: BlogHeaderProps) {
  const [deleteBlog, { isSuccess, error }] = useDeleteBlogMutation({});
  const router = useRouter();

  useEffect(() => {}, [isSuccess]);

  const deleteBlogHandler = async () => {
    const deletedBlogData = await deleteBlog(id);
    if ("data" in deletedBlogData && deletedBlogData?.data?.success) {
      toast.success("Blog has been deleted.");
      router.push("/blogs");
    } else {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are You Sure?",
      text: "Are you sure to delete this Blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        deleteBlogHandler();
      }
    });
  };

  return (
    <>
      <div className="mb-8 md:mb-16 sm:mx-0 flex justify-center items-center p-6">
        <CoverImage title={title} coverImage={coverImage} slug={slug} />
      </div>

      <div className="max-w-2xl mx-auto">
        <BlogTitle>{title}</BlogTitle>
      </div>
      <div className="max-w-2xl mx-auto flex justify-between">
        <div>
          <div className="block mb-6">
            <Avatar />
          </div>
          <div className="mb-6 text-md">
            {" "}
            {(contentLength / 1000).toFixed(0)} mins read -{" "}
            {formatToStringDate(date)}
          </div>
        </div>
        <div className="flex gap-3">
          <RiDeleteBin5Line
            size={20}
            color="red"
            title="delete"
            onClick={handleDelete}
            className="cursor-pointer"
          />
          <Link href={`/blogs/update/${id}`}>
            <RiEdit2Line size={20} title="Edit" />
          </Link>
        </div>
      </div>
    </>
  );
}
