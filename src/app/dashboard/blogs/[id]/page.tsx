'use client';

import { useGetBlogByIdQuery } from '@/redux/features/blog/blogApi';
import React from 'react';
// import loginBg from "../../../public/assets/loginBg.png";
import BlogHeader from '@/app/_components/Blog/BlogHeader';
import BlogBody from '@/app/_components/Blog/BlogBody';
import BlogNav from '@/app/_components/Blog/BlogNav';
import Protected from '@/app/hooks/useProtected';

export default function Page({ params }: any) {
  const { isLoading, data, refetch } = useGetBlogByIdQuery(params.id);

  return (
    <Protected>
      <div className="h-[80px]">
        <BlogNav />
      </div>
      <article>
        <BlogHeader
          id={params.id}
          title={data?.blog?.title}
          coverImage={data?.blog?.banner ?? '/assets/loginBg.png'}
          date={data?.blog?.createdAt}
          slug={data?.blog?.slug}
          contentLength={data?.blog?.content.length}
        />
        <BlogBody content={data?.blog?.content} />
      </article>
    </Protected>
  );
}
