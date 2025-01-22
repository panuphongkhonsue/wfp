import { format, differenceInDays } from "date-fns";
import { th } from 'date-fns/locale';

export function formatDate(d) {
  if (d) return format(d, "yyyy-MM-dd");
  return "-";
}

export function formatDateSlash(d) {
  if (d) return format(d, "yyyy/MM/dd");
  return "-";
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
  if (d) return `${format(d, 'dd/MMM', { locale: th })}/${d.getFullYear() + 543}`;
  return "-";
}
export function dateDiff(d1, d2) {
  if (!d1 || !d2) return null;
  const df = differenceInDays(d1, d2);
  if (df < 0) return 0;
  return df;
}

