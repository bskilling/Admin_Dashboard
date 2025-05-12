'use client';

import Image from 'next/image';
import React, { Suspense, useEffect, useState } from 'react';
// import loginBg from "../../public/assets/loginBg.png";
import Link from 'next/link';
import { IoIosAdd } from 'react-icons/io';
// import loginPageLogo from "../../public/assets/loginPageLogo.png";
import { useGetAllBlogsQuery } from '@/redux/features/blog/blogApi';
import { LiaEdit } from 'react-icons/lia';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { formatToStringDate } from '@/utils/formatter';

const Header = ({ courseId, setEditModal }: any) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-[50]  ${
        scrolled ? 'bg-white' : ''
      } bg-opacity-30 bg-gray-200 backdrop-filter backdrop-blur-lg h-[80px] flex justify-between items-center px-6 w-screen`}
    >
      <div>
        <Link href="/learning/trainings" className="flex gap-2 items-center text-xl">
          <Image src={'/assets/loginPageLogo.png'} alt="logo" width="120" height="120" />
        </Link>
      </div>
      <Link href="/dashboard/blogs/create" className="p-3 flex justify-center items-center">
        <LiaEdit size={40} className="text-gray-400" />

        <p className="text-gray-600">Write</p>
      </Link>
    </header>
  );
};

export default function Page() {
  const { isLoading, data, refetch } = useGetAllBlogsQuery({}, { refetchOnMountOrArgChange: true });

  return (
    <Suspense>
      <div className="min-h-screen w-full bg-gray-200">
        <div className="h-[80px]">
          <Header />
        </div>

        <div className="px-6 pb-4">
          <div className="flex justify-center items-center py-4 px-6">
            <h2 className="text-4xl">Latest Blog Posts</h2>
          </div>
          <div className="flex justify-center items-center flex-wrap gap-6">
            {data?.posts?.map((val: any, index: any) => (
              <Link href={`/dashboard/blogs/${val._id}`} key={val}>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-lg w-80 h-96 transition-all hover:scale-105 cursor-pointer group">
                  <Image
                    src={val?.banner ?? '/assets/loginBg.png'}
                    alt="banner"
                    className="rounded-md object-cover w-full h-full"
                    width={400}
                    height={200}
                    style={{ height: '200px', width: '100%' }}
                  />
                  <div className="p-4">
                    <div className="text-sm text-gray-600 items-center flex justify-between">
                      <span className="mr-2 font-semibold">BSkilling</span>
                      <span>{formatToStringDate(val.createdAt)}</span>
                    </div>
                    <div className="font-bold text-xl my-2">{val?.title || ''}</div>
                    <p
                      className="text-gray-700 text-base"
                      dangerouslySetInnerHTML={{
                        __html:
                          val?.content?.length > 150
                            ? val?.content?.slice(0, 100) + '...'
                            : val?.content,
                      }}
                    />
                  </div>
                  <Link
                    href={`/dashboard/blogs/${val._id}`}
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <FaExternalLinkAlt className="text-gray-600 hover:text-gray-800" />
                  </Link>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
