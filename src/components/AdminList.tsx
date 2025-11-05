// components/admin/AdminList.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { IAdminUser } from '@/models/AdminUser';

interface AdminListProps extends IAdminUser {
  _id: string; // or `_id: Types.ObjectId;` if using Mongoose
}

export default function AdminList() {
  const { isSuperAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminListProps[]>([]);

  useEffect(() => {
    if (isSuperAdmin) {
      axios.get('/api/admin/users').then(res => setAdmins(res.data));
    }
  }, [isSuperAdmin]);

  if (!isSuperAdmin) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Users</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin._id}>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>{admin.isActive ? 'Active' : 'Inactive'}</td>
              <td>{/* Add action buttons here */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
