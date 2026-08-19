import type { SavedFields } from "./types";

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function displaySavedValue(
  key: keyof SavedFields,
  fields: SavedFields,
): string {
  if (key === "total") return formatMoney(fields.total, fields.currency);
  if (key === "tax") {
    return fields.tax === null ? "—" : formatMoney(fields.tax, fields.currency);
  }
  if (key === "date") return formatDate(fields.date);
  const value = fields[key];
  return value ? String(value) : "—";
}
