// app/dashboard/edmingle-users/page.tsx
'use client';

import UserEnrollmentTable from './_components/UserEnrollmentTable';

export default function EdmingleUsersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <UserEnrollmentTable />
    </div>
  );
}
