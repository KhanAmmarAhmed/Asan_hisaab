# Payable Invoice API - Quick Reference

## Three-Step Process

### Step 1: Initialize Order

```
🔵 Endpoint: POST /create_order.php
📋 Action: Create order and get invoice number

Input:
  action: "Payable"
  entity: "Vendor Name"
  date: "2026-04-20"

Output:
  {
    "success": true,
    "data": {
      "id": "10",
      "invoice": "P-23429",        // ← SAVE THIS!
      "entity_name": "Vendor Name",
      "type": "Payable"
    }
  }

Function: createOrderApi()
Location: src/services/invoiceApi.js:340
```

---

### Step 2: Add Line Items

```
🔵 Endpoint: POST /save_order.php
📋 Action: Add item to order (called once per item)

Input (for each item):
  action: "order"
  invoice: "P-23429"              // ← From Step 1
  item_name: "Item Name"
  qty: 1
  price: 10.00
  total: 10.00

Output:
  {
    "success": true,
    "message": "Order added successfully",
    "data": {
      "order": {...},
      "order_items": {...}
    }
  }

Function: createOrderItemApi() - for single item
         createOrderItemsApi() - for batch
Location: src/services/invoiceApi.js:121
```

---

### Step 3: Finalize Invoice

```
🔵 Endpoint: POST /save_order.php
📋 Action: Save final payable invoice details

Input:
  action: "save_invoice"
  invoice_no: "P-23429"            // ← From Step 1
  amount: 1000.00                  // Total from all items
  sub_total: 900.00                // amount - discount
  taxable: "yes" or "no"
  grand_total: 1035.00             // sub_total + (tax if yes)
  discount: 100.00                 // Absolute discount amount

Output:
  {
    "success": true,
    "message": "Order added successfully",
    "data": {
      "order": {...},
      "order_items": {...},
      "Payable_details": {...}
    }
  }

Function: savePayableInvoiceApi()
Location: src/services/invoiceApi.js:85
```

---

## Key Code Functions

### 1. Create Order

```javascript
import { createOrderApi } from "@/services/invoiceApi";

const response = await createOrderApi({
  type: "Payable",
  entity: "Vendor Name",
  dueDate: "2026-04-20",
});

// response.invoice = "P-23429"
// response.id = "10"
```

### 2. Save Items

```javascript
import { createOrderItemsApi } from "@/services/invoiceApi";

const items = [
  { itemName: "Item 1", quantity: 1, price: 10, total: 10 },
  { itemName: "Item 2", quantity: 2, price: 20, total: 40 },
];

await createOrderItemsApi(invoiceNo, items);
```

### 3. Save Payable Details

```javascript
import { savePayableInvoiceApi } from "@/services/invoiceApi";

await savePayableInvoiceApi({
  voucher: "P-23429",
  amount: 50,
  discount: 5,
  subTotal: 45,
  taxAble: "yes",
  grandTotal: 51.75,
});
```

---

## Modal Modal Transitions

```
User Selects "Payable"
         ↓
payable-step1 (Entity + Date)
         ↓ [Next - calls createOrderApi]
payable-step1.5 (Add Items)
         ↓ [Next - calls createOrderItemsApi]
payable-step2 (Summary + Details)
         ↓ [Save - calls savePayableInvoiceApi + addInvoiceApi]
Invoice Table Display
```

---

## Calculations

### Sub Total

```
sub_total = amount - discount
```

### Tax (if Taxable = "yes")

```
tax = sub_total * 0.15  (15% tax rate)
```

### Grand Total

```
grand_total = sub_total + tax
```

---

## Important Data Mappings

| Frontend Field | API Parameter | Notes                            |
| -------------- | ------------- | -------------------------------- |
| voucher        | invoice_no    | Invoice number from create_order |
| taxAble        | taxable       | "yes" or "no" string             |
| entityName     | entity        | Vendor/Customer/Employee name    |
| dueDate        | date          | Date string YYYY-MM-DD           |
| itemName       | item_name     | Line item description            |
| quantity       | qty           | Integer quantity                 |

---

## Error Scenarios

| Error                | Cause                   | Solution                   |
| -------------------- | ----------------------- | -------------------------- |
| No invoice number    | create_order.php failed | Check entity and date      |
| Items not saving     | Invoice number mismatch | Verify invoice from step 1 |
| Grand total mismatch | Tax calculation         | Check taxable setting      |
| Invoice not in table | addInvoiceApi failed    | Check API response         |

---

## Console Debugging

All API calls log to console:

```javascript
// Enable debug logging
localStorage.setItem("PAYABLE_INVOICE_DEBUG", "true");

// Look for these patterns:
// 📤 Creating Order        - Step 1 API call
// ✅ Order Created         - Step 1 success
// 📤 Creating Order Items  - Step 1.5 API call
// ✅ Items Created         - Step 1.5 success
// 💾 Saving payable        - Step 2 API call
// ✅ Payable details saved - Step 2 success
// 🎉 Payable Invoice Complete - All steps done
```

---

## Common Issues & Solutions

### Q: Invoice number not showing in next step?

**A:** Check that createOrderApi returns `data.invoice`. Verify API response format matches expectations.

### Q: Items not appearing in step 2?

**A:** Confirm createOrderItemsApi loop completes. Items should be in payableData.items array.

### Q: Calculations incorrect?

**A:** Check taxable flag value. Should be "Yes" or "No" string, not boolean. Tax = 15% of sub_total.

### Q: Invoice not appearing in table?

**A:** Verify addInvoiceApi completes successfully. Check DataContext is updated properly.
