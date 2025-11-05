// components/RelatedContents.tsx
import React from 'react';
import RelatedCoursesSelect from './RelatedCoursesSelect';
import RelatedBlogsSelect from './RelatedBlogsSelect';

export default function RelatedContents({
  control,
  initialData,
}: {
  control: any;
  initialData?: {
    relatedBlogs?: any[];
    relatedCourses?: any[];
  };
}) {
  return (
    <div className="bg-white p-6 border rounded-lg shadow-sm mt-6">
      <h3 className="text-lg font-medium mb-4">Related Content</h3>

      <RelatedBlogsSelect control={control} initialSelected={initialData?.relatedBlogs} />

      <RelatedCoursesSelect control={control} initialSelected={initialData?.relatedCourses} />
    </div>
  );
}
