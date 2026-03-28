'use client';
// app/dashboard/purchases/enrollments/page.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import env from '@/lib/env';
import Link from 'next/link';
import { SlidersHorizontal, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../_components/Page';
// import { StatusBadge, PaymentTypeBadge } from '../page';

const ADMIN_URL = env.BACKEND_URL + '/api/admin-payments';

export default function AllEnrollmentsPage() {
  const [filters, setFilters] = useState({
    status: '',
    paymentType: '',
    page: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-enrollments', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('page', String(filters.page));
      params.set('limit', '20');
      if (filters.status) params.set('status', filters.status);
      if (filters.paymentType) params.set('paymentType', filters.paymentType);
      return axios.get(`${ADMIN_URL}/enrollments?${params}`).then(r => r.data.data);
    },
    placeholderData: prev => prev,
  });

  const set = (key: string, val: string) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const enrollments = data?.enrollments ?? [];
  const pagination = data?.pagination;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Enrollments</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination?.total ?? 0} total enrollments</p>
        </div>
        <Link href="/dashboard/purchases" className="text-sm text-gray-500 hover:text-gray-700">
          ← Overview
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
        <select
          value={filters.status}
          onChange={e => set('status', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value="">All Statuses</option>
          <option value="enrolled">Enrolled</option>
          <option value="partially_paid">Partially Paid (EMI)</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.paymentType}
          onChange={e => set('paymentType', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value="">All Types</option>
          <option value="full">Full Payment</option>
          <option value="installment">Installment (EMI)</option>
        </select>

        {(filters.status || filters.paymentType) && (
          <button
            onClick={() => setFilters({ status: '', paymentType: '', page: 1 })}
            className="text-xs text-red-500 hover:text-red-700 ml-auto"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-100">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Installments
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Access</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                    Enrolled At
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrollments.map((e: any) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{e.userId?.name || '—'}</div>
                      <div className="text-xs text-gray-400">{e.userId?.email}</div>
                      {e.userId?.phone && (
                        <div className="text-xs text-gray-400">{e.userId.phone}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 max-w-[180px]">
                      <span className="text-gray-700 line-clamp-2 text-xs">
                        {e.courseId?.title || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={e.enrollmentStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={e.paymentStatus} />
                    </td>
                    <td className="px-5 py-3 text-center">
                      {e.totalInstallments > 0 ? (
                        <span className="text-sm font-medium text-violet-700">
                          {e.installmentsPaid}/{e.totalInstallments}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-900 font-medium whitespace-nowrap">
                      {e.paidAmount ? `₹${Number(e.paidAmount).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-5 py-3">
                      {e.accessGranted ? (
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
                          title="Access granted"
                        />
                      ) : (
                        <span
                          className="w-2 h-2 rounded-full bg-gray-300 inline-block"
                          title="No access"
                        />
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {e.enrolledAt
                        ? new Date(e.enrolledAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : new Date(e.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/purchases/enrollments/${e._id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-gray-400">
                      No enrollments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
            <span className="text-gray-500">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
