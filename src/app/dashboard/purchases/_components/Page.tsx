import { CalendarClock, CreditCard } from 'lucide-react';

export function PaymentTypeBadge({
  type,
  installmentNumber,
}: {
  type: string;
  installmentNumber?: number;
}) {
  if (type === 'installment') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
        <CalendarClock className="w-3 h-3" />
        EMI {installmentNumber ? `#${installmentNumber}` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
      <CreditCard className="w-3 h-3" />
      Full
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    enrolled: { label: 'Enrolled', className: 'bg-emerald-100 text-emerald-700' },
    partially_paid: { label: 'Partial EMI', className: 'bg-violet-100 text-violet-700' },
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
    completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
    SUCCESS: { label: 'Success', className: 'bg-emerald-100 text-emerald-700' },
    FAILED: { label: 'Failed', className: 'bg-red-100 text-red-600' },
    PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
    INITIATED: { label: 'Initiated', className: 'bg-gray-100 text-gray-600' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
  };
  const config = map[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
