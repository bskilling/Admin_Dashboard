"use client";

import { useState } from "react";
import { useCategories, useDeleteCategory } from "../_components/useCategories";
import { BlogCategory } from "../_components/types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CategoryForm from "../_components/CategoryForm";

export default function CategoriesManagementPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories
  const { data, isLoading, isError, refetch } = useCategories({
    page: currentPage,
    limit: 10,
    search: searchQuery,
  });

  // Delete mutation
  const deleteMutation = useDeleteCategory();

  // Handle delete
  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      setIsDeleting(id);

      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Category deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete category");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Handle category modal close
  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
    refetch();
  };

  // Handle category edit
  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
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

  //   // Error state
  //   if (isError) {
  //     return (
  //       <div className="text-center py-10 text-red-500">
  //         <h2 className="text-2xl font-bold">Error loading categories</h2>
  //         <p className="mt-2">Please try again later</p>
  //       </div>
  //     );
  //   }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Categories Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
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

          {/* Add category button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data.categories.length > 0 ? (
              data.categories.map((category: BlogCategory) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {category.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.color ? (
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm text-gray-500">
                          {category.color}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/dashboard/blog?category=${category.slug}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        disabled={isDeleting === category._id}
                        className={`text-red-600 hover:text-red-900 ${
                          isDeleting === category._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isDeleting === category._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

      {/* Category modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingCategory ? "Edit Category" : "Add Category"}
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

            <CategoryForm
              initialData={editingCategory || undefined}
              isEditing={!!editingCategory}
              onComplete={handleModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
