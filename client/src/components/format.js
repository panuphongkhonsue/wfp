import { format, differenceInDays } from "date-fns";
import { th } from 'date-fns/locale';

export function formatDate(d) {
  if (d) return format(d, "yyyy-MM-dd");
  return "-";
}

export function formatDateSlash(d) {
  if (d) return format(d, "dd/MMM/yyyy");
  return null;
}

export function formatDateServer(d) {
  if (d) return format(d, "yyyy-MM-dd");
  return null;
}

export function format3Digits(d) {
  if (d) return format(d, "dd-MMM-yyyy");
  return "-";
}

export function formatDateTime(d) {
  if (d) return format(d, "MMM dd, yyyy HH:mm:ss");
  return "-";
}

export function format3DigitsDateTime(d) {
  if (d) return format(d, "dd-MMM-yyyy HH:mm:ss");
  return "-";
}

export function formatTime(d) {
  if (d) return format(d, "HH:mm:ss");
  return "-";
}

export function formatCurrency(n) {
  return n ? new Intl.NumberFormat().format(n) : "-";
}
export function formatDateThaiSlash(d) {
  if (!d) return "-";

  const dateObj = new Date(d);

  if (isNaN(dateObj)) return "-";

  return `${format(dateObj, "dd/MMM", { locale: th })}/${dateObj.getFullYear() + 543}`;
}
export function dateDiff(d1, d2) {
  if (!d1 || !d2) return null;
  const df = differenceInDays(d1, d2);
  if (df < 0) return 0;
  return df;
}

export function formatNumber(val) {
  const number = Number(val); // Convert to number
  if (!isNaN(number)) {
    return number.toLocaleString("en-US"); // Format as '3,000'
  }
  return `-`; // If conversion fails, return a fallback value
}

export function toThaiYear(year){
  return year+543;
}

export function toEngYear(year){
  return year-543;
}
