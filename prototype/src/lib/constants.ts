export const CATEGORIES = [
  "Office Supplies",
  "Meals & Entertainment",
  "Travel",
  "Utilities",
  "Software & Subscriptions",
  "Professional Services",
  "Other",
] as const;

export const PAYMENT_METHODS = [
  "Credit Card",
  "Debit Card",
  "Cash",
  "ACH",
  "Check",
  "Other",
] as const;

export const CURRENCIES = ["USD", "CAD", "EUR", "GBP", "MXN"] as const;

export const FIELD_NAMES = [
  "vendor",
  "date",
  "total",
  "tax",
  "invoiceNumber",
  "category",
  "paymentMethod",
  "currency",
] as const;

export const REVIEW_THRESHOLD = 0.75;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const MIN_PROCESSING_MS = 1600;
