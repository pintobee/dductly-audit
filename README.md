# dductly AI Audit

Hi. This is a short product audit of dductly, plus a working prototype of one idea.

I looked at how financial information gets into dductly today. A lot of it is still typed by hand. Someone has a receipt, then copies vendor, date, total, and tax into the product. That is slow, easy to mistype, and more work than it needs to be.

Here is the current workflow:

https://github.com/user-attachments/assets/9efdb004-0935-4345-9fca-8e64587aa01e

## The idea

A simpler path:

**Upload a receipt → AI reads it → you review → save**

AI fills in the first draft. You check it. The original document stays attached.

It would pull out things like vendor, date, total, tax, category, payment method, and invoice number. Every field stays editable. Nothing is saved until you confirm.

```text
Receipt / Invoice
       ↓
   AI Vision
       ↓
Extracted Information
       ↓
   You review
       ↓
Saved Transaction
```

That is the loop for this audit: spot a problem, try a solution, keep a person in the loop, then see if it is worth building for real.

The longer write-up is in [`audit.md`](audit.md). That is the audit document, with more of the thinking and insights behind this idea.

## Try the prototype

The walkthrough lives in [`prototype/`](prototype/). Open it, pick a sample receipt, and you can go from upload to a saved transaction in about a minute.

Setup and the demo path (no API key needed) are in the [prototype README](prototype/README.md). It does not use dductly production code, credentials, or customer data.
