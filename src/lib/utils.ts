import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(abs));
  return isNegative ? `-${formatted} ₫` : `${formatted} ₫`;
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('vi-VN').format(val);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
