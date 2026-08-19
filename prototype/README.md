# dductly AI Receipt Capture

This is a small prototype that shows how dductly could turn a receipt photo into a bookkeeping transaction.

Snap or upload a document, let AI fill in the details, check the results, and save. The original receipt stays attached.

This is a standalone demo. It does not use dductly production code, credentials, or customer data. The sample receipts are fictional.

## Why this exists

Today, someone still has to type vendor, date, total, and tax from a receipt into the product. That is slow, easy to mistype, and more work than the purchase itself.

This prototype tries a simpler path:

**Upload → AI reads it → you review → save**

You stay in control. AI does the first draft. You confirm before anything is saved.

## Why AI?

Receipts do not share one layout. A warehouse club slip, a dinner bill, and a professional invoice all put the important numbers in different places. A vision model can look at the whole page and return structured fields, instead of relying on a brittle template.

## How it is put together

The app is intentionally small, so it is easy to explain.

1. The frontend handles upload, review, and save.
2. A single API route (`POST /api/extract`) sends the image to a vision model, or uses a mock extractor if no API key is set.
3. The response comes back as JSON, with a confidence score on each field.
4. Zod checks the data. The review screen lets you edit everything.
5. Saving keeps the last transaction in memory. There is no database.

```text
You → app → /api/extract → AI or demo data → review → save
```

## Built-in guardrails

AI helps. It does not file the books on its own.

- Nothing is saved until you say so.
- Uncertain fields get a **Review** badge.
- Vendor, date, totals, tax, and currency are validated before save.
- The original document stays with the transaction.
- If the file is the wrong type, too large, or unreadable, you get a clear message and can still enter the details by hand.

## Run it locally

```bash
cd prototype
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Want live extraction? Copy `.env.example` to `.env.local` and add an OpenAI key as `AI_API_KEY`. Leave it blank and the app still works in demo mode.

```bash
cp .env.example .env.local
```

## Try it without an API key

This is the path to use in an interview. It never calls a model.

1. Open the app.
2. Under **Or try a sample receipt**, pick Simple receipt, Itemized receipt, or Professional invoice.
3. Watch the short “Reading your receipt…” moment.
4. Check the extracted fields. Anything uncertain is marked **Review**.
5. Change a value if you like, then **Save transaction**.
6. Hit **View transaction**. You should still see the original document attached.

You can also upload your own photo with no key. The app stays in demo mode and lets you fill in the fields from the preview.
