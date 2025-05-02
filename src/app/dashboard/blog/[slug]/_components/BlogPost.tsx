// components/blog/BlogPost.tsx
"use client";

import { useState } from "react";
import {
  useBlog,
  useRelatedBlogs,
  useLikeBlog,
  useShareBlog,
} from "../../_components/useblog";
import { Blog } from "../../_components/types";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import BlogCard from "../../_components/BlogCard";
import { toast } from "react-hot-toast";

interface BlogPostProps {
  slug: string;
}

export default function BlogPost({ slug }: BlogPostProps) {
  const router = useRouter();

  // Fetch blog data
  const { data, isLoading, isError } = useBlog(slug);
  const blog = data?.blog;

  // Fetch related blogs if blog id exists
  const { data: relatedData } = useRelatedBlogs(blog?._id || "");
  const relatedBlogs = relatedData?.relatedBlogs || [];

  // Like and share mutations
  const likeMutation = useLikeBlog();
  const shareMutation = useShareBlog();

  // State for UI interactions
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // Handle like button click
  const handleLike = () => {
    if (!blog) return;

    likeMutation.mutate(blog._id);
    toast.success("Thanks for liking this article!");
  };

  // Handle share button click
  const handleShare = async (platform: string) => {
    if (!blog) return;

    // Update share count in the database
    shareMutation.mutate(blog._id);

    // Share URL
    const shareUrl = `${window.location.origin}/blog/${blog.slug}`;

    // Share text
    const shareText = `Check out this article: ${blog.title}`;

    // Share based on platform
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard!");
        } catch (err) {
          toast.error("Failed to copy link");
        }
        break;
    }

    setIsShareMenuOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !blog) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-500">
            Blog post not found
          </h2>
          <p className="mt-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/dashboard/blog")}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-8">
        <ol className="flex flex-wrap items-center">
          <li className="flex items-center">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <svg
              className="w-3 h-3 mx-2 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </li>
          <li className="flex items-center">
            <Link
              href="/dashboard/blog"
              className="text-gray-500 hover:text-blue-600"
            >
              Blog
            </Link>
            <svg
              className="w-3 h-3 mx-2 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </li>
          <li className="text-gray-700 truncate max-w-xs">{blog.title}</li>
        </ol>
      </nav>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.isArray(blog.categories) &&
          blog.categories.map((category: any) => (
            <Link
              href={`/dashboard/blog?category=${typeof category === "string" ? category : category.slug}`}
              key={typeof category === "string" ? category : category._id}
              className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {typeof category === "string" ? category : category.name}
            </Link>
          ))}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>

      {/* Article metadata */}
      <div className="flex flex-wrap items-center justify-between gap-y-4 pb-6 mb-8 border-b border-gray-200">
        <div className="flex items-center">
          {/* Author photo if available */}
          {blog.author &&
            typeof blog.author !== "string" &&
            blog.author.profilePicture && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={blog.author.profilePicture as string}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

          <div>
            {/* Author name */}
            <div className="font-medium">
              {blog.author
                ? typeof blog.author === "string"
                  ? blog.author
                  : blog.author.name
                : "Unknown Author"}
            </div>

            {/* Publication date */}
            <div className="text-sm text-gray-500">
              {blog.publishedAt
                ? format(new Date(blog.publishedAt), "MMMM d, yyyy")
                : format(new Date(blog.createdAt), "MMMM d, yyyy")}

              {/* Show update date if available */}
              {blog.lastUpdatedAt && (
                <span>
                  {" "}
                  · Updated{" "}
                  {format(new Date(blog.lastUpdatedAt), "MMMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Read time */}
          <div className="flex items-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{blog.readTime} min read</span>
          </div>

          {/* Like button */}
          <button
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{blog.likeCount}</span>
          </button>

          {/* Share button */}
          <div className="relative">
            <button
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>

            {/* Share dropdown */}
            {isShareMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <ul className="py-2">
                  <li>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.599-.1-.899a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
                      </svg>
                      Twitter
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                      </svg>
                      Facebook
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 17H6.477v-7H9v7zM7.694 8.717c-.771 0-1.286-.514-1.286-1.2s.514-1.2 1.371-1.2c.771 0 1.286.514 1.286 1.2s-.514 1.2-1.371 1.2zM18 17h-2.442v-3.826c0-1.058-.651-1.302-.895-1.302s-1.058.163-1.058 1.302V17h-2.523v-7h2.523v.977c.325-.57.976-.977 2.197-.977S18 10.977 18 13.174V17z" />
                      </svg>
                      LinkedIn
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleShare("copy")}
                      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Copy Link
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="w-full h-96 relative mb-10 rounded-lg overflow-hidden">
          <Image
            src={blog.featuredImage as string}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 75vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Table of contents */}
      {blog.tableOfContents && blog.tableOfContents.length > 0 && (
        <div className="mb-10 lg:float-right lg:ml-10 lg:mb-5 w-full lg:w-64 p-5 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
          <ul className="space-y-2">
            {blog.tableOfContents.map((item) => (
              <li
                key={item.id}
                className="text-blue-600 hover:text-blue-800"
                style={{ marginLeft: `${(item.level - 1) * 12}px` }}
              >
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Blog content */}
      <div
        className="prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags */}
      {Array.isArray(blog.tags) && blog.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: any) => (
              <Link
                href={`/dashboard/blog?tag=${typeof tag === "string" ? tag : tag.slug}`}
                key={typeof tag === "string" ? tag : tag._id}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {typeof tag === "string" ? tag : tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Author bio if available */}
      {blog.author && typeof blog.author !== "string" && blog.author.bio && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-start gap-5 p-6 bg-gray-50 rounded-lg">
            {/* Author photo */}
            {blog.author.profilePicture && (
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                <Image
                  src={blog.author.profilePicture as string}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold mb-2">
                About {blog.author.name}
              </h3>
              <p className="text-gray-700">{blog.author.bio}</p>

              {/* Social links */}
              {blog.author.socialLinks &&
                Object.values(blog.author.socialLinks).some(
                  (link) => !!link
                ) && (
                  <div className="mt-3 flex space-x-4">
                    {blog.author.socialLinks.twitter && (
                      <a
                        href={blog.author.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <svg
                          className="w-6 h-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.599-.1-.899a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
                        </svg>
                      </a>
                    )}

                    {blog.author.socialLinks.linkedin && (
                      <a
                        href={blog.author.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:text-blue-900"
                      >
                        <svg
                          className="w-6 h-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 17H6.477v-7H9v7zM7.694 8.717c-.771 0-1.286-.514-1.286-1.2s.514-1.2 1.371-1.2c.771 0 1.286.514 1.286 1.2s-.514 1.2-1.371 1.2zM18 17h-2.442v-3.826c0-1.058-.651-1.302-.895-1.302s-1.058.163-1.058 1.302V17h-2.523v-7h2.523v.977c.325-.57.976-.977 2.197-.977S18 10.977 18 13.174V17z" />
                        </svg>
                      </a>
                    )}

                    {blog.author.socialLinks.github && (
                      <a
                        href={blog.author.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-800 hover:text-gray-600"
                      >
                        <svg
                          className="w-6 h-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </a>
                    )}

                    {blog.author.socialLinks.website && (
                      <a
                        href={blog.author.socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <svg
                          className="w-6 h-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Related blogs */}
      {relatedBlogs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((blog: Blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
