# dductly AI Audit Intro

## AI Receipt & Invoice Capture


For this audit, I looked at dductly's current workflows and identified manual receipt and invoice entry as an area that could be improved.

This is how the current workflow looks



https://github.com/user-attachments/assets/9efdb004-0935-4345-9fca-8e64587aa01e



### The idea

Instead of manually entering information from a receipt, a user could:

**Upload a receipt → AI reads it → Review the information → Save**

The AI would extract information such as:

- Vendor
- Date
- Total
- Tax
- Category
- Payment method
- Invoice number

The user can review and edit everything before saving, and the original receipt stays attached to the transaction.

### How it works

```text
Receipt / Invoice
       ↓
   AI Vision
       ↓
Extracted Information
       ↓
   User Review
       ↓
Saved Transaction
