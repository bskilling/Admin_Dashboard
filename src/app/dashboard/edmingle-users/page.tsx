// app/dashboard/edmingle-users/page.tsx
'use client';

import { NasscomHeader } from './_components/NasscomHeader';
import UserEnrollmentTable from './_components/UserEnrollmentTable';

export default function EdmingleUsersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <NasscomHeader />
      <UserEnrollmentTable />
    </div>
  );
}
