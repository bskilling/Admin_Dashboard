'use client';
import CourseContent from '@/app/_components/CourseContent';
import React, { useState } from 'react';

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen w-full">
      {/* <Sidebar /> */}
      <CourseContent />
    </div>
  );
};

export default Page;
