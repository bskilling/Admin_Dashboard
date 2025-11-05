'use client';

// app/blog/edit/[id]/page.tsx
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/lib/api';
import { Blog } from '../../_components/types';
import BlogForm from '../../[slug]/_components/BlogForm';

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;

  // Fetch blog data
  const { data, isLoading, isError } = useQuery<{ blog: Blog }>({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getById(id).then(res => res.data.data),
    staleTime: 0, // Don't cache for edit page
  });

  // Handle not found or error
  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  // Loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  // Not found
  if (!data || !data.blog) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <BlogForm initialData={data.blog} isEditing={true} />
    </main>
  );
}
