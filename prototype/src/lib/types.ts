import type { CATEGORIES, CURRENCIES, FIELD_NAMES, PAYMENT_METHODS } from "./constants";

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type Currency = (typeof CURRENCIES)[number];
export type FieldName = (typeof FIELD_NAMES)[number];

export type FormFields = {
  vendor: string;
  date: string;
  total: string;
  tax: string;
  invoiceNumber: string;
  category: string;
  paymentMethod: string;
  currency: string;
};

export type ConfidenceMap = Partial<Record<FieldName, number>>;

export type SavedFields = {
  vendor: string;
  date: string;
  total: number;
  tax: number | null;
  invoiceNumber: string;
  category: string;
  paymentMethod: string;
  currency: Currency;
};

export type ExtractionSource = "mock" | "ai";

export type ExtractSuccess = {
  ok: true;
  source: ExtractionSource;
  fields: FormFields;
  confidence: ConfidenceMap;
  warning: string | null;
};

export type ExtractErrorCode =
  | "unsupported_type"
  | "file_too_large"
  | "no_document"
  | "ai_unavailable"
  | "invalid_json"
  | "unreadable";

export type ExtractFailure = {
  ok: false;
  code: ExtractErrorCode;
  message: string;
};

export type ExtractResponse = ExtractSuccess | ExtractFailure;

export type SampleId = "simple" | "restaurant" | "invoice";

export type SampleDocument = {
  id: SampleId;
  title: string;
  description: string;
  fields: FormFields;
  confidence: Required<ConfidenceMap>;
};

export type SavedTransaction = {
  id: string;
  fields: SavedFields;
  documentUrl: string;
  documentName: string;
  savedAt: string;
};

export type Phase = "empty" | "processing" | "review" | "success" | "view";
