import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Returns the number of days in a given month.
 * @param {number} year  - Full year, e.g. 2026
 * @param {number} month - 1-indexed month (1 = January, 12 = December)
 */
export function getDaysInMonth(year, month) {
    // new Date(year, month, 0) = day 0 of the NEXT month = last day of THIS month
    // month here is 1-indexed, so month=2 → new Date(year, 2, 0) = last day of Feb ✓
    return new Date(year, month, 0).getDate();
}

/**
 * Returns the weekday index (0=Sun … 6=Sat) of the 1st day of a given month.
 * @param {number} year  - Full year
 * @param {number} month - 1-indexed month
 */
export function getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1).getDay();
}
