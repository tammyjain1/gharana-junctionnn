import { format, parseISO } from 'date-fns';

export function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function shortDate(value) {
  if (!value) return '-';
  return format(typeof value === 'string' ? parseISO(value) : value, 'dd MMM yyyy');
}

export function dateTime(value) {
  if (!value) return '-';
  return format(typeof value === 'string' ? parseISO(value) : value, 'dd MMM yyyy, h:mm a');
}

export function initials(nameOrEmail = '') {
  return nameOrEmail
    .split(/[ @.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
