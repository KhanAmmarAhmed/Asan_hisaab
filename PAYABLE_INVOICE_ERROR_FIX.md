# Payable Invoice Creation Error: "Invoice not found"

## Problem

When saving a payable or receivable invoice, you get an alert:

```
Failed to create payable invoice: Invoice not found
```

## Root Cause Analysis

The error comes from the backend checking if an invoice exists before allowing you to perform operations on it. There are several possible causes:

### 1. **Wrong Operation Order** (Most Likely)

The current code flow is:

1. Create order items (references invoice)
2. Save the invoice

The backend expects the **opposite** order:

1. **Save the invoice first** (create the record)
2. Then create order items

### 2. **Invoice Not Found in Database**

The backend `/save_order.php` endpoint requires the invoice to already exist. The order items must reference an existing invoice.

### 3. **Missing Invoice Creation Step**

You might need to explicitly create/register the invoice in the database before adding items to it.

### 4. **CORS Preventing Request**

The API call might be failing silently due to CORS, causing the backend to return "Invoice not found" error.

---

## Solution: Fix the Invoice Creation Order

The correct flow should be:

```javascript
const handlePayableStep2Submit = async (data) => {
  try {
    console.log("🚀 Starting Payable Invoice Creation...");

    const newVoucher = String(invoices.length + 1).padStart(2, "0");

    // ... prepare newEntry ...

    // ✅ STEP 1: SAVE THE INVOICE FIRST
    console.log("💾 Saving payable invoice...");
    const saveResult = await savePayableInvoiceApi({
      ...newEntry,
      voucher: newVoucher,
    });
    console.log("✅ Invoice saved to API successfully!", saveResult);

    // ✅ STEP 2: THEN CREATE ORDER ITEMS (AFTER invoice exists)
    if (payableData.items && payableData.items.length > 0) {
      console.log(`📦 Creating ${payableData.items.length} order items...`);
      const itemsWithVoucher = payableData.items.map((item) => ({
        ...item,
        voucher: newVoucher,
        invoiceNo: newVoucher,
      }));

      await createOrderItemsApi(newVoucher, itemsWithVoucher);
      console.log("✅ All order items created successfully!");
    }

    // ✅ STEP 3: ADD TO LOCAL STATE
    addInvoice(newEntry);
    console.log("✅ Payable invoice added to local state:", newEntry);

    // Close modal
    setIsModalOpen(false);
    setModalMode("selection");
    resetPayableData();

    console.log("🎉 Payable Invoice Creation Completed Successfully!");
  } catch (error) {
    console.error("❌ Error creating payable invoice:", error);
    alert(`Failed to create payable invoice: ${error.message}`);
  }
};
```

### Key Changes:

1. **Move `savePayableInvoiceApi()` to BEFORE `createOrderItemsApi()`**
2. Items are only created after the invoice is confirmed to exist in the database

---

## Update InvoicesPage.jsx

Edit the `handlePayableStep2Submit` function to reorder the API calls:

```javascript
// WRONG ORDER (Current - Causes Error)
// 1. Create items first
await createOrderItemsApi(...);
// 2. Save invoice second
await savePayableInvoiceApi(...);

// RIGHT ORDER (Fixed)
// 1. Save invoice first
await savePayableInvoiceApi(...);
// 2. Create items second
await createOrderItemsApi(...);
```

---

## Verification Steps

### Step 1: Check Console Logs

Before the fix, you'll see:

```
🚀 Starting Payable Invoice Creation...
📦 Creating X order items...
❌ Error creating payable invoice: Invoice not found
```

After the fix, you should see:

```
🚀 Starting Payable Invoice Creation...
💾 Saving payable invoice...
✅ Invoice saved to API successfully!
📦 Creating X order items...
✅ All order items created successfully!
✅ Payable invoice added to local state
🎉 Payable Invoice Creation Completed Successfully!
```

### Step 2: Check Network Tab

1. Open **Developer Tools** → **Network** tab
2. Create a payable invoice
3. Look for requests to:
   - `/save_order.php` - Should come **FIRST** and return success
   - `/create_order.php` - Should come **SECOND** and return success

The order matters! `/save_order.php` must complete before `/create_order.php`.

### Step 3: Backend Response

Success response should look like:

```json
{
  "success": true,
  "message": "Invoice saved successfully",
  "data": { ... }
}
```

Error response:

```json
{
  "success": false,
  "message": "Invoice not found",
  "error": "Cannot create items for non-existent invoice"
}
```

---

## Backend Expectations

### For `/save_order.php` (Step 1)

**Expected POST Parameters:**

- `action`: "save_invoice"
- `invoice_no`: "01", "02", etc. (generated voucher)
- `amount`: number
- `sub_total`: number
- `taxable`: "yes" or "no"
- `grand_total`: number
- `discount`: number

**Expected Response:**

```json
{
  "success": true,
  "message": "Invoice saved",
  "data": { "invoiceId": "..." }
}
```

### For `/create_order.php` (Step 2 - After invoice exists)

**Expected POST Parameters:**

- `action`: "order"
- `invoice`: "01" (must match saved invoice)
- `item_name`: "Item Name"
- `qty`: number
- `price`: number
- `total`: number

**Expected Response:**

```json
{
  "success": true,
  "message": "Item created"
}
```

---

## Checklist

- [ ] Reordered API calls in `handlePayableStep2Submit()`
- [ ] `/save_order.php` called **BEFORE** `/create_order.php`
- [ ] Voucher ID consistency across both calls
- [ ] Test creating payable invoice
- [ ] Console logs show correct order
- [ ] Network tab shows requests in correct sequence
- [ ] Backend returns success for both endpoints
- [ ] Invoice appears in local state after creation

---

## Still Getting "Invoice not found"?

If you're still seeing the error after reordering, check:

1. **Check CORS** - See CORS_FIX_GUIDE.md

   ```
   Access-Control-Allow-Origin headers must be set
   ```

2. **Check Backend Logs**
   - Does `/save_order.php` actually create the invoice record?
   - Is the database connection working?

3. **Check Voucher Format**
   - Backend might expect different voucher format
   - Try: "INV-001" vs "01"
   - Or: UUID vs numeric

4. **Test Backend Directly**

   ```bash
   curl -X POST https://server/save_order.php \
     -d "action=save_invoice&invoice_no=01&amount=100&..."
   ```

5. **Enable Backend Logging**
   - Add logging to `/save_order.php`
   - Log all parameters received
   - Log if invoice record was created

---

## Quick Fix Summary

**In `InvoicesPage.jsx`, function `handlePayableStep2Submit()`:**

**MOVE THIS BLOCK:**

```javascript
// Step 2: Save the invoice
console.log("💾 Saving payable invoice...");
const saveResult = await savePayableInvoiceApi({
  ...newEntry,
  voucher: newVoucher,
});
console.log("✅ Invoice saved to API successfully!", saveResult);
```

**TO HERE (before creating items):**

```javascript
// Step 1: Create all order items first
if (payableData.items && payableData.items.length > 0) {
```

Change lines 317-327 to be **AFTER** save invoice, not **BEFORE**.
