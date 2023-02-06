import { getDay } from 'date-fns';
import { Hours } from '../types';

export const tap: (title: string) => <T>(_: T) => T = (title) => (data) => {
  console.log(`tap::${title}`, JSON.stringify(data));
  return data;
};

export function convertRemToPixels(rem: number): number {
  if (typeof window === 'undefined') return 0;
  if (!window || !document) return 0;
  return (
    rem *
    parseFloat(window?.getComputedStyle(document.documentElement).fontSize)
  );
}

export const isWeekday = (date: Date) => {
  const day = getDay(date);
  return day !== 0 && day !== 6;
};
export const avg = (data: Hours): string => {
  const diffs = Object.entries(data.days).map(([_, v]) => v - 7);
  const sum = (diffs.length && diffs.reduce((t, v) => t + v)) || 0;
  console.log(diffs, sum);
  return `${sum > 0 ? '+' : '-'} ${sum.toFixed(1)}`;
};
export const deZero = (s: string) =>
  !s.length || s === '0' ? '' : s.charAt(0) !== '0' ? s : s.substring(1);

export const bounce = { duration: 1.5, type: 'spring' };
export const appear = { scale: [0, 1] };
