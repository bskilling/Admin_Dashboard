import { clsx, type ClassValue } from "clsx";
import { format, formatDistance } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string with a friendly display
 * @param dateString ISO date string
 * @returns Formatted date with relative time if recent
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // If date is within the last 7 days, show relative time
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays < 7) {
    return formatDistance(date, now, { addSuffix: true });
  }

  // Otherwise, show formatted date
  return format(date, "MMM d, yyyy");
}

/**
 * Format a price/amount as currency
 * @param amount Amount to format
 * @param currency Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount);
}
