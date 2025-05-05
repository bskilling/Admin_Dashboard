import { Controller } from "react-hook-form";
import { useState } from "react";
import { useCategories } from "../../_components/useCategories";
import { useBlogs } from "../../_components/useblog";
import { cn } from "@/lib/utils"; // Utility for className merging (optional)

export default function RelatedBlogsSelect({
  control,
  initialSelected = [],
}: {
  control: any;
  initialSelected?: string[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const { data: categories } = useCategories();
  const { data: blogData, isLoading } = useBlogs({
    category: selectedCategory,
    limit: 100,
  });

  return (
    <div className="mb-6 space-y-6">
      {/* Category Selector */}
      {categories && categories.categories.length > 0 && (
        <div>
          <label className="block text-sm font-semibold mb-2">
            Blog Category
          </label>
          <select
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || undefined)}
          >
            <option value="">All Categories</option>
            {categories.categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Blog Card Selector */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Select Related Blogs
        </label>

        <Controller
          name="relatedBlogs"
          control={control}
          defaultValue={initialSelected}
          render={({ field }) => {
            const selected = field.value;

            const toggleBlog = (id: string) => {
              if (selected.includes(id)) {
                field.onChange(selected.filter((b: string) => b !== id));
              } else {
                field.onChange([...selected, id]);
              }
            };

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="text-gray-500 col-span-full">
                    Loading blogs...
                  </div>
                ) : blogData?.blogs?.length ? (
                  blogData.blogs.map((blog) => {
                    const isSelected = selected.includes(blog._id);
                    return (
                      <div
                        key={blog._id}
                        onClick={() => toggleBlog(blog._id)}
                        className={cn(
                          "cursor-pointer border rounded-lg p-4 transition-shadow duration-200",
                          isSelected
                            ? "bg-blue-100 border-blue-500 shadow-md"
                            : "bg-white hover:shadow"
                        )}
                      >
                        <h3 className="font-medium text-sm">
                          {typeof blog === "string" ? blog : blog.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {isSelected ? "Click to remove" : "Click to add"}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 col-span-full">
                    No blogs found
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
