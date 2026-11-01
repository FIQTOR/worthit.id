import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiahInput(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseRupiahInput(value: string): number {
  return parseInt(value.replace(/\D/g, ''), 10) || 0;
}
