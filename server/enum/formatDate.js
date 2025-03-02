const { format, differenceInDays } = require("date-fns");
const { th } = require("date-fns/locale");

function formatDate(d) {
  if (d) return format(d, "yyyy-MM-dd");
  return "-";
}

function formatDateSlash(d) {
  if (d) return format(d, "dd/MMM/yyyy");
  return null;
}

function formatDateServer(d) {
  if (d) return format(d, "yyyy-MM-dd");
  return null;
}

function format3Digits(d) {
  if (d) return format(d, "dd-MMM-yyyy");
  return "-";
}

function formatDateTime(d) {
  if (d) return format(d, "MMM dd, yyyy HH:mm:ss");
  return "-";
}

function format3DigitsDateTime(d) {
  if (d) return format(d, "dd-MMM-yyyy HH:mm:ss");
  return "-";
}

function formatTime(d) {
  if (d) return format(d, "HH:mm:ss");
  return "-";
}

function formatCurrency(n) {
  return n ? new Intl.NumberFormat().format(n) : "-";
}

function formatDateThaiSlash(d) {
  if (!d) return "-";

  const dateObj = new Date(d);

  if (isNaN(dateObj)) return "-";

  return `${format(dateObj, "dd/MMM", { locale: th })}/${dateObj.getFullYear() + 543}`;
}

function dateDiff(d1, d2) {
  if (!d1 || !d2) return null;
  const df = differenceInDays(d1, d2);
  if (df < 0) return 0;
  return df;
}

function formatNumber(val) {
  const number = Number(val);
  if (!isNaN(number)) {
    return number.toLocaleString("en-US");
  }
  return `${val}`;
}

module.exports = {
  formatDate,
  formatDateSlash,
  formatDateServer,
  format3Digits,
  formatDateTime,
  format3DigitsDateTime,
  formatTime,
  formatCurrency,
  formatDateThaiSlash,
  dateDiff,
  formatNumber,
};
