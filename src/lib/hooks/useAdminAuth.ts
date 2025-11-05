// hooks/useAdminAuth.ts
import { useSession } from 'next-auth/react';
import { AdminRole } from '@/models/AdminUser';

export const useAdminAuth = () => {
  const { data: session, status } = useSession();

  const isSuperAdmin = session?.user.role === AdminRole.SUPER_ADMIN;
  const isAdmin = isSuperAdmin || session?.user.role === AdminRole.ADMIN;

  return {
    user: session?.user,
    isAdmin,
    isSuperAdmin,
    isLoading: status === 'loading',
  };
};
