import type { SampleDocument } from "./types";

export const samples: SampleDocument[] = [
  {
    id: "simple",
    title: "Simple receipt",
    description: "Warehouse club purchase",
    fields: {
      vendor: "Harbor Wholesale Club",
      date: "2026-08-15",
      total: "42.87",
      tax: "3.12",
      invoiceNumber: "",
      category: "Office Supplies",
      paymentMethod: "Credit Card",
      currency: "USD",
    },
    confidence: {
      vendor: 0.96,
      date: 0.94,
      total: 0.98,
      tax: 0.91,
      invoiceNumber: 0.92,
      category: 0.62,
      paymentMethod: 0.88,
      currency: 0.99,
    },
  },
  {
    id: "restaurant",
    title: "Itemized receipt",
    description: "Restaurant bill with tax and tip",
    fields: {
      vendor: "The Oak & Vine",
      date: "2026-08-12",
      total: "98.04",
      tax: "6.84",
      invoiceNumber: "",
      category: "Meals & Entertainment",
      paymentMethod: "Credit Card",
      currency: "USD",
    },
    confidence: {
      vendor: 0.93,
      date: 0.9,
      total: 0.81,
      tax: 0.54,
      invoiceNumber: 0.86,
      category: 0.68,
      paymentMethod: 0.84,
      currency: 0.97,
    },
  },
  {
    id: "invoice",
    title: "Professional invoice",
    description: "Services invoice with invoice number",
    fields: {
      vendor: "Lumen & Co.",
      date: "2026-08-03",
      total: "1850.00",
      tax: "0.00",
      invoiceNumber: "INV-2026-0841",
      category: "Professional Services",
      paymentMethod: "",
      currency: "USD",
    },
    confidence: {
      vendor: 0.97,
      date: 0.95,
      total: 0.96,
      tax: 0.9,
      invoiceNumber: 0.98,
      category: 0.89,
      paymentMethod: 0.41,
      currency: 0.99,
    },
  },
];

export function getSample(id: string): SampleDocument | undefined {
  return samples.find((sample) => sample.id === id);
}
