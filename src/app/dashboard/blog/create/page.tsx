// app/blog/create/page.tsx
import { Metadata } from 'next';
import BlogForm from '../[slug]/_components/BlogForm';

export const metadata: Metadata = {
  title: 'Create Blog Post | Your Website Name',
  description: 'Create a new blog post',
};

export default function CreateBlogPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogForm />
    </main>
  );
}
