'use client';
// app/dashboard/purchases/enrollments/[enrollmentId]/page.tsx

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import env from '@/lib/env';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { PaymentTypeBadge, StatusBadge } from '../../_components/Page';
// import { StatusBadge, PaymentTypeBadge } from '../../page';

const ADMIN_URL = env.BACKEND_URL + '/api/admin-payments';

export default function EnrollmentDetailPage() {
  const { enrollmentId } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-enrollment-detail', enrollmentId],
    queryFn: () => axios.get(`${ADMIN_URL}/enrollments/${enrollmentId}`).then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="p-6 text-gray-400">Enrollment not found</div>;

  const { enrollment, payments, orders } = data;
  const isInstallment = enrollment.totalInstallments > 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Enrollment Detail</h1>
            <p className="text-xs text-gray-400 font-mono">{enrollment._id}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={enrollment.enrollmentStatus} />
            <StatusBadge status={enrollment.paymentStatus} />
            {enrollment.accessGranted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                <CheckCircle className="w-3 h-3" /> Access Granted
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoBlock
            label="Student"
            value={enrollment.userId?.name}
            sub={enrollment.userId?.email}
          />
          <InfoBlock label="Phone" value={enrollment.userId?.phone || '—'} />
          <InfoBlock label="Course" value={enrollment.courseId?.title} />
          <InfoBlock
            label="Paid Amount"
            value={
              enrollment.paidAmount
                ? `₹${Number(enrollment.paidAmount).toLocaleString('en-IN')}`
                : '—'
            }
          />
          <InfoBlock label="Currency" value={enrollment.currency} />
          <InfoBlock
            label="Enrolled At"
            value={
              enrollment.enrolledAt
                ? new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'
            }
          />
        </div>

        {enrollment.discountApplied?.code && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            🏷 Coupon: <strong className="font-mono">{enrollment.discountApplied.code}</strong>
            {enrollment.discountApplied.value &&
              ` · ${enrollment.discountApplied.value}${enrollment.discountApplied.type === 'coupon' ? '%' : '₹'} off`}
          </div>
        )}
      </div>

      {/* Installment progress */}
      {isInstallment && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Installment Progress — {enrollment.installmentsPaid}/{enrollment.totalInstallments} paid
          </h2>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all"
              style={{
                width: `${(enrollment.installmentsPaid / enrollment.totalInstallments) * 100}%`,
              }}
            />
          </div>
          <div className="space-y-3">
            {enrollment.installmentPayments?.map((inst: any) => (
              <div
                key={inst.installmentNumber}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  inst.status === 'paid'
                    ? 'border-emerald-200 bg-emerald-50'
                    : inst.status === 'overdue'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {inst.status === 'paid' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : inst.status === 'overdue' ? (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {inst.label || `Installment #${inst.installmentNumber}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due{' '}
                      {new Date(inst.dueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {inst.paidAt &&
                        ` · Paid ${new Date(inst.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                    </p>
                    {inst.transactionId && (
                      <p className="text-xs font-mono text-gray-400 mt-0.5">
                        Txn: {inst.transactionId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{Number(inst.amount).toLocaleString('en-IN')}
                  </p>
                  <span
                    className={`text-xs font-medium ${inst.status === 'paid' ? 'text-emerald-600' : inst.status === 'overdue' ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    {inst.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">
            Payment Records ({payments.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Txn ID</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p: any) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    ₹{(p.amount / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <PaymentTypeBadge
                      type={p.metaInfo?.paymentType || 'full'}
                      installmentNumber={p.metaInfo?.installmentNumber}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{p.paymentMethod || '—'}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500 max-w-[120px] truncate">
                    {p.transactionId || '—'}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500 max-w-[120px] truncate">
                    {p.orderId || '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-center text-gray-400">
                    No payment records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, sub }: { label: string; value?: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
