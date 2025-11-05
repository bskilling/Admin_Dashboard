// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from './_components/BlogPost';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

// For SEO metadata
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    // In a real application, you'd fetch this data server-side
    // But for simplicity, we'll just use a basic title here
    return {
      title: `Blog Post | Your Website Name`,
    };
  } catch (error) {
    return {
      title: 'Blog Post | Your Website Name',
    };
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  const { slug } = params;

  if (!slug) {
    return notFound();
  }

  return (
    <main>
      <BlogPost slug={slug} />
    </main>
  );
}
