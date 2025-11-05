'use client';

import { useState } from 'react';
import CreateCategory from './_components/CreateCategory';
import Typess from './_components/Typess';
import { useSearchParams } from 'next/navigation';

export default function RouteComponent() {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState<'b2b' | 'b2c' | 'b2g' | 'b2i' | null>(
    searchParams.get('type') as 'b2b' | 'b2c' | 'b2g' | 'b2i' | null
  );
  return (
    <div className="w-full">
      <Typess selectedType={selectedType} setSelectedType={setSelectedType} />
      {/* <MigrationButton /> */}
      <CreateCategory selectedType={selectedType} />
    </div>
  );
}
