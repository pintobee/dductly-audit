"use client";

import { CATEGORIES, CURRENCIES, PAYMENT_METHODS } from "@/lib/constants";
import { needsReview } from "@/lib/validation";
import type { ConfidenceMap, ExtractionSource, FormFields } from "@/lib/types";
import { Field, fieldControlClass } from "./Field";

type ExtractedFormProps = {
  fields: FormFields;
  confidence: ConfidenceMap;
  errors: Partial<Record<keyof FormFields, string>>;
  warning: string | null;
  source: ExtractionSource;
  onChange: (name: keyof FormFields, value: string) => void;
};

export function ExtractedForm({
  fields,
  confidence,
  errors,
  warning,
  source,
  onChange,
}: ExtractedFormProps) {
  return (
    <section className="flex flex-col p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-900">Extracted information</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {source === "ai"
            ? "AI filled these fields from your document. Confirm them before saving."
            : "These fields were prepared for review. Confirm or complete them before saving."}
        </p>
      </div>

      {warning ? (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
          {warning}
        </div>
      ) : (
        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
          AI extraction is a starting point. Please confirm every field before saving.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            label="Vendor"
            htmlFor="vendor"
            needsReview={needsReview(confidence, "vendor", fields.vendor)}
            error={errors.vendor}
          >
            <input
              id="vendor"
              value={fields.vendor}
              onChange={(event) => onChange("vendor", event.target.value)}
              className={fieldControlClass({
                error: Boolean(errors.vendor),
                review: needsReview(confidence, "vendor", fields.vendor),
              })}
              autoComplete="off"
            />
          </Field>
        </div>

        <Field
          label="Date"
          htmlFor="date"
          needsReview={needsReview(confidence, "date", fields.date)}
          error={errors.date}
        >
          <input
            id="date"
            type="date"
            value={fields.date}
            onChange={(event) => onChange("date", event.target.value)}
            className={fieldControlClass({
              error: Boolean(errors.date),
              review: needsReview(confidence, "date", fields.date),
            })}
          />
        </Field>

        <Field
          label="Currency"
          htmlFor="currency"
          needsReview={needsReview(confidence, "currency", fields.currency)}
          error={errors.currency}
        >
          <select
            id="currency"
            value={fields.currency}
            onChange={(event) => onChange("currency", event.target.value)}
            className={fieldControlClass({
              error: Boolean(errors.currency),
              review: needsReview(confidence, "currency", fields.currency),
            })}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Total"
          htmlFor="total"
          needsReview={needsReview(confidence, "total", fields.total)}
          error={errors.total}
        >
          <input
            id="total"
            inputMode="decimal"
            value={fields.total}
            onChange={(event) => onChange("total", event.target.value)}
            className={fieldControlClass({
              error: Boolean(errors.total),
              review: needsReview(confidence, "total", fields.total),
            })}
            placeholder="0.00"
          />
        </Field>

        <Field
          label="Tax"
          htmlFor="tax"
          needsReview={needsReview(confidence, "tax", fields.tax)}
          error={errors.tax}
        >
          <input
            id="tax"
            inputMode="decimal"
            value={fields.tax}
            onChange={(event) => onChange("tax", event.target.value)}
            className={fieldControlClass({
              error: Boolean(errors.tax),
              review: needsReview(confidence, "tax", fields.tax),
            })}
            placeholder="0.00"
          />
        </Field>

        <Field
          label="Invoice number"
          htmlFor="invoiceNumber"
          needsReview={needsReview(confidence, "invoiceNumber", fields.invoiceNumber)}
          error={errors.invoiceNumber}
        >
          <input
            id="invoiceNumber"
            value={fields.invoiceNumber}
            onChange={(event) => onChange("invoiceNumber", event.target.value)}
            className={fieldControlClass({
              error: Boolean(errors.invoiceNumber),
              review: needsReview(confidence, "invoiceNumber", fields.invoiceNumber),
            })}
            placeholder="Optional"
          />
        </Field>

        <Field
          label="Category"
          htmlFor="category"
          needsReview={needsReview(confidence, "category", fields.category)}
          error={errors.category}
        >
          <select
            id="category"
            value={fields.category}
            onChange={(event) => onChange("category", event.target.value)}
            className={fieldControlClass({
              error: Boolean(errors.category),
              review: needsReview(confidence, "category", fields.category),
            })}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Payment method"
            htmlFor="paymentMethod"
            needsReview={needsReview(confidence, "paymentMethod", fields.paymentMethod)}
            error={errors.paymentMethod}
          >
            <select
              id="paymentMethod"
              value={fields.paymentMethod}
              onChange={(event) => onChange("paymentMethod", event.target.value)}
              className={fieldControlClass({
                error: Boolean(errors.paymentMethod),
                review: needsReview(confidence, "paymentMethod", fields.paymentMethod),
              })}
            >
              <option value="">Select a payment method</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </section>
  );
}
