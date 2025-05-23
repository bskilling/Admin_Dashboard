// utils/purchaseUtils.ts

import { PurchaseStatus } from './types';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const formatCurrency = (amount: string | number, currency: string = 'INR'): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getStatusConfig = (status: PurchaseStatus) => {
  const configs = {
    SUCCESS: {
      variant: 'default' as const,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 border-green-200',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      label: 'Success',
    },
    PENDING: {
      variant: 'secondary' as const,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      label: 'Pending',
    },
    FAILED: {
      variant: 'destructive' as const,
      icon: XCircle,
      color: 'bg-red-100 text-red-800 border-red-200',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      label: 'Failed',
    },
  };

  return configs[status] || configs.PENDING;
};

export const calculatePercentageChange = (
  current: number,
  previous: number
): {
  percentage: number;
  isPositive: boolean;
} => {
  if (previous === 0) {
    return { percentage: current > 0 ? 100 : 0, isPositive: current >= 0 };
  }

  const percentage = ((current - previous) / previous) * 100;
  return {
    percentage: Math.abs(percentage),
    isPositive: percentage >= 0,
  };
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD_${timestamp}${random}`;
};

export const getMonthName = (monthNumber: number): string => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[monthNumber - 1] || 'Unknown';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
