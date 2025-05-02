"use client";

import { useState } from "react";
import { useTags, useDeleteTag } from "../_components/useTags";
import { Tag } from "../_components/types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TagForm from "../_components/TagForm";

export default function TagsManagementPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch tags
  const { data, isLoading, isError, refetch } = useTags({
    page: currentPage,
    limit: 20,
    search: searchQuery,
  });

  // Delete mutation
  const deleteMutation = useDeleteTag();

  // Handle delete
  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this tag? This action cannot be undone."
      )
    ) {
      setIsDeleting(id);

      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Tag deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete tag");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Handle tag modal close
  const handleModalClose = () => {
    setShowModal(false);
    setEditingTag(null);
    refetch();
  };

  // Handle tag edit
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setShowModal(true);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        <h2 className="text-2xl font-bold">Error loading tags</h2>
        <p className="mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Tags Management</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="px-4 py-2 border rounded-l-lg w-full"
            />
            <button
              type="submit"
              className="bg-gray-100 px-4 py-2 border border-l-0 rounded-r-lg hover:bg-gray-200"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Add tag button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Tag
          </button>
        </div>
      </div>

      {/* Tags grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data && data.tags.length > 0 ? (
          data.tags.map((tag: Tag) => (
            <div
              key={tag._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color || "#3B82F6" }}
                ></div>
                <div className="space-x-1">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(tag._id)}
                    disabled={isDeleting === tag._id}
                    className={`text-red-600 hover:text-red-900 ${
                      isDeleting === tag._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <Link
                href={`/dashboard/blog?tag=${tag.slug}`}
                className="hover:text-blue-600"
              >
                <h3 className="text-lg font-medium">{tag.name}</h3>
              </Link>
              <div className="text-sm text-gray-500 mt-1">/{tag.slug}</div>
              {tag.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {tag.description}
                </p>
              )}
              <div className="mt-2 flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    tag.isActive ? "bg-green-500" : "bg-red-500"
                  } mr-1`}
                ></span>
                <span className="text-xs text-gray-500">
                  {tag.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No tags found
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!data.pagination.hasPrevPage}
              className={`px-3 py-1 rounded-md ${
                data.pagination.hasPrevPage
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {data.pagination.currentPage} of {data.pagination.totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!data.pagination.hasNextPage}
              className={`px-3 py-1 rounded-md ${
                data.pagination.hasNextPage
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Tag modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingTag ? "Edit Tag" : "Add Tag"}
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <TagForm
              initialData={editingTag || undefined}
              isEditing={!!editingTag}
              onComplete={handleModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
