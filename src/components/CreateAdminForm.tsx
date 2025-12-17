// src/components/admin/CreateAdminForm.tsx
import { useState } from 'react';
import { AdminRole } from '@/models/AdminUser';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function CreateAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>(AdminRole.ADMIN);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isSuperAdmin } = useAdminAuth();

  if (!isSuperAdmin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create admin');
      }

      onSuccess();
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Create New Admin</h3>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as AdminRole)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={AdminRole.ADMIN}>Admin</option>
            <option value={AdminRole.SUPER_ADMIN}>Super Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
}
