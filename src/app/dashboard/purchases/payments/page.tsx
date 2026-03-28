'use client';
// app/dashboard/purchases/payments/page.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import env from '@/lib/env';
import Link from 'next/link';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { PaymentTypeBadge, StatusBadge } from '../_components/Page';
// import { StatusBadge, PaymentTypeBadge } from '../page';

const ADMIN_URL = env.BACKEND_URL + '/api/admin-payments';

interface Filters {
  status: string;
  paymentType: string;
  env: string;
  search: string;
  page: number;
}

export default function AllPaymentsPage() {
  const [filters, setFilters] = useState<Filters>({
    status: '',
    paymentType: '',
    env: 'PRODUCTION',
    search: '',
    page: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('page', String(filters.page));
      params.set('limit', '20');
      if (filters.status) params.set('status', filters.status);
      if (filters.paymentType) params.set('paymentType', filters.paymentType);
      if (filters.env) params.set('env', filters.env);
      return axios.get(`${ADMIN_URL}/payments?${params}`).then(r => r.data.data);
    },
    placeholderData: prev => prev,
  });

  const set = (key: keyof Filters, val: string) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const payments = data?.payments ?? [];
  const pagination = data?.pagination;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Payments</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination?.total ?? 0} total payments</p>
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
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="INITIATED">Initiated</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
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

        <select
          value={filters.env}
          onChange={e => set('env', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value="">All Envs</option>
          <option value="PRODUCTION">Production</option>
          <option value="SANDBOX">Sandbox</option>
        </select>

        {(filters.status || filters.paymentType || filters.env !== 'PRODUCTION') && (
          <button
            onClick={() =>
              setFilters({ status: '', paymentType: '', env: 'PRODUCTION', search: '', page: 1 })
            }
            className="text-xs text-red-500 hover:text-red-700 ml-auto"
          >
            Clear filters
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
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Txn ID</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p: any) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{p.userId?.name || '—'}</div>
                      <div className="text-xs text-gray-400">{p.userId?.email}</div>
                    </td>
                    <td className="px-5 py-3 max-w-[180px]">
                      <span className="text-gray-700 line-clamp-2 text-xs">
                        {p.courseId?.title || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      ₹{Number(p.amountInRupees).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                      <PaymentTypeBadge
                        type={p.paymentType}
                        installmentNumber={p.installmentNumber}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{p.paymentMethod || '—'}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-500 truncate block max-w-[120px]">
                        {p.transactionId || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/purchases/payments/${p._id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-gray-400">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
