/**
 * Date Utility Module for BIT Mesra Guest House
 * Provides calendar-accurate date arithmetic free of timezone/DST boundary shifts.
 */

/**
 * Pad number to 2 digits
 */
const pad = (num) => String(num).padStart(2, '0');

/**
 * Convert a Date object to YYYY-MM-DD string using local calendar fields
 */
export function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string into a local Date at noon (12:00:00)
 * Setting noon avoids any daylight saving or timezone boundary clipping.
 */
export function parseDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const d = new Date(year, month, day, 12, 0, 0);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Get today's date formatted as YYYY-MM-DD
 */
export function getTodayString() {
  return formatDate(new Date());
}

/**
 * Add days to a YYYY-MM-DD string or Date object
 * Handles leap years, month boundaries, and year rollover accurately.
 */
export function addDays(dateInput, days = 1) {
  const d = typeof dateInput === 'string' ? parseDate(dateInput) : new Date(dateInput);
  if (!d) return getTodayString();
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * Compute the minimum valid check-out date for a given check-in date
 * Check-out must be at least 1 calendar day after check-in.
 */
export function getMinCheckOut(checkInStr) {
  if (!checkInStr) return addDays(getTodayString(), 1);
  return addDays(checkInStr, 1);
}

/**
 * Calculate total number of nights between check-in and check-out.
 * Returns at least 1 night.
 */
export function calculateNights(checkInStr, checkOutStr) {
  if (!checkInStr || !checkOutStr) return 1;
  const inDate = parseDate(checkInStr);
  const outDate = parseDate(checkOutStr);
  if (!inDate || !outDate) return 1;

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((outDate.getTime() - inDate.getTime()) / msPerDay);
  return diffDays > 0 ? diffDays : 1;
}

/**
 * Validate and sanitize check-in and check-out pair
 * Ensures checkOut is strictly after checkIn by at least 1 day.
 */
export function sanitizeDatePair(checkIn, checkOut) {
  const today = getTodayString();
  const validCheckIn = checkIn && checkIn >= today ? checkIn : today;
  const minCheckOut = addDays(validCheckIn, 1);
  const validCheckOut = checkOut && checkOut >= minCheckOut ? checkOut : minCheckOut;
  return {
    checkIn: validCheckIn,
    checkOut: validCheckOut,
    nights: calculateNights(validCheckIn, validCheckOut),
  };
}

/**
 * Format date for friendly human display (e.g. "25 Nov 2026, Wednesday")
 */
export function formatDisplayDate(dateStr, isHindi = false) {
  const d = parseDate(dateStr);
  if (!d) return { dateText: isHindi ? 'तारीख चुनें' : 'Select Date', dayText: '' };

  const locale = isHindi ? 'hi-IN' : 'en-IN';
  const day = d.getDate();
  const month = d.toLocaleDateString(locale, { month: 'short' });
  const year = d.getFullYear();
  const dayName = d.toLocaleDateString(locale, { weekday: 'long' });

  return {
    dateText: `${day} ${month} ${year}`,
    dayText: dayName,
    shortText: `${day} ${month}'${String(year).slice(-2)}`,
  };
}
