// app/blog/page.tsx
import { Metadata } from "next";
import BlogList from "./_components/BlogList";

export const metadata: Metadata = {
  title: "Blog | Your Website Name",
  description: "Explore our latest articles, tutorials, and insights",
};

export default function BlogPage() {
  return (
    <main>
      <BlogList />
    </main>
  );
}
