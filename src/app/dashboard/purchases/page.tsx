'use client';
// app/dashboard/purchases/page.tsx

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import env from '@/lib/env';
import Link from 'next/link';
import { IndianRupee, Users, Clock, CalendarClock } from 'lucide-react';
import { PaymentTypeBadge } from './_components/Page';

const ADMIN_URL = env.BACKEND_URL + '/api/admin-payments';

function fetchDashboard() {
  return axios.get(ADMIN_URL + '/dashboard').then(r => r.data.data);
}

export default function PurchasesOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchDashboard,
    refetchInterval: 30_000,
  });

  if (isLoading)
    return (
      <PageShell>
        <LoadingState />
      </PageShell>
    );
  if (error || !data)
    return (
      <PageShell>
        <ErrorState />
      </PageShell>
    );

  const { summary, installments, recentPayments } = data;

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchases Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Live payment & enrollment summary</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/purchases/payments"
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            All Payments
          </Link>
          <Link
            href="/dashboard/purchases/enrollments"
            className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            All Enrollments
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={`₹${Number(summary.totalRevenue).toLocaleString('en-IN')}`}
          sub={`${summary.successfulPayments} payments`}
          icon={<IndianRupee className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          label="Total Enrollments"
          value={summary.totalEnrollments}
          sub={`${summary.enrolled} active`}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Partial Payments"
          value={installments.totalInstallmentEnrollments}
          sub={`${installments.partiallyPaid} pending next installment`}
          icon={<CalendarClock className="w-5 h-5" />}
          color="violet"
        />
        <StatCard
          label="Pending"
          value={summary.pending}
          sub={`${summary.cancelled} cancelled`}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Enrollment Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Enrolled (Full Access)', value: summary.enrolled, color: 'bg-emerald-500' },
              {
                label: 'Partially Paid (EMI)',
                value: summary.partiallyPaid,
                color: 'bg-violet-500',
              },
              { label: 'Pending', value: summary.pending, color: 'bg-amber-500' },
              { label: 'Cancelled', value: summary.cancelled, color: 'bg-red-400' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                  <span className="text-sm text-gray-600">{row.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{row.value ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Installment Stats</h2>
          <div className="space-y-3">
            {[
              { label: 'Total EMI Enrollments', value: installments.totalInstallmentEnrollments },
              { label: 'All Installments Paid', value: installments.fullyPaid },
              { label: 'Partially Paid (pending more)', value: installments.partiallyPaid },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{row.label}</span>
                <span className="text-sm font-semibold text-gray-900">{row.value ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recent Successful Payments</h2>
          <Link
            href="/dashboard/purchases/payments?status=SUCCESS"
            className="text-xs text-indigo-600 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPayments?.map((p: any) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{p.user?.name || '—'}</div>
                    <div className="text-xs text-gray-400">{p.user?.email}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-gray-700 line-clamp-1 max-w-[180px] block">
                      {p.course?.title || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    ₹{Number(p.amountInRupees).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3">
                    <PaymentTypeBadge
                      type={p.paymentType}
                      installmentNumber={p.installmentNumber}
                    />
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.paymentMethod || '—'}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {p.completedAt
                      ? new Date(p.completedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
              {(!recentPayments || recentPayments.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    No payments yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

// ── Shared components ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: any;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-9 h-9 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="p-6 max-w-7xl mx-auto">{children}</div>;
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Failed to load. Check your API connection.
    </div>
  );
}
