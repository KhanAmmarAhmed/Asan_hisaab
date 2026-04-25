# Payable Invoice API Integration Guide

## Overview

This guide explains the API integration for the **Payable Invoice** feature, which allows adding items to an invoice and saving them via API endpoints.

---

## API Endpoints Integrated

### 1. **Save Invoice Endpoint**

- **URL**: `https://fisddemoprojects.com/assanhisaab/save_order.php`
- **Method**: POST
- **Body Parameters** (form-data):
  - `action`: `"save_invoice"`
  - `invoice_no`: Invoice number (e.g., "01")
  - `amount`: Total amount
  - `sub_total`: Subtotal amount
  - `taxable`: "yes" or "no"
  - `grand_total`: Grand total amount
  - `discount`: Discount amount/percentage

**API Function**: `savePayableInvoiceApi()` in `/src/services/invoiceApi.js`

### 2. **Create Order Item Endpoint**

- **URL**: `https://fisddemoprojects.com/assanhisaab/create_order.php`
- **Method**: POST
- **Body Parameters** (form-data):
  - `action`: `"order"`
  - `invoice`: Invoice number
  - `item_name`: Item name
  - `qty`: Quantity
  - `price`: Unit price
  - `total`: Total (qty × price)

**API Function**: `createOrderItemApi()` in `/src/services/invoiceApi.js`

**Batch Function**: `createOrderItemsApi()` - Creates multiple items in sequence

---

## Flow and Implementation

### Step-by-Step Flow

1. **User Clicks "Add Invoice"** → Selects "Payable"
2. **Step 1: Enter Entity Details**
   - Select Entity (Customer/Employee/Vendor)
   - Due Date
   - → Next

3. **Step 1.5: Add Items** ⭐ NEW
   - Enter Item Name
   - Enter Quantity
   - Enter Price
   - Click "Add Item"
   - Items are added to the modal
   - Review items in the table
   - → Next

4. **Step 2: Review & Save** ⭐ API CALL HERE
   - View items summary table
   - Enter Discount (%)
   - Select Taxable (Yes/No)
   - Grand total calculates automatically
   - Click "Save" → **Triggers API calls**

### API Call Sequence (on Save)

```
Step 2 Submit
    ↓
[1] Create all order items (create_order.php)
    ↓ (for each item)
    Create item 1 ✅
    Create item 2 ✅
    Create item 3 ✅
    ↓
[2] Save invoice (save_order.php)
    ↓
[3] Add to local state
    ↓
Close modal ✅
```

---

## Console Logging for Testing

The implementation includes comprehensive console logging at multiple points:

### 📝 Item Addition

When you add an item in Step 1.5:

```javascript
📝 Adding Item to Payable Invoice: {
  itemName: "Office Supplies",
  quantity: 5,
  price: 100,
  total: 500,
  itemId: 1697123456789
}
✅ Item added successfully! Total items: 1
```

### 📤 Form Submission

When submitting the form:

```javascript
📤 Submitting Form Data: {
  mode: "payable-step2",
  finalData: { items: [...], discount: 10, taxAble: "Yes", ... },
  itemsCount: 3,
  itemsTotal: 1500
}
```

### 📤 API Calls

**Creating Order Items:**

```javascript
📤 Creating Multiple Order Items for Invoice: 01
📤 Creating Order Item: {
  invoice: "01",
  item_name: "Office Supplies",
  qty: 5,
  price: 100,
  total: 500
}
✅ Create Order Item Response: { success: true, ... }
```

**Saving Invoice:**

```javascript
📤 Saving Payable Invoice: {
  invoice_no: "01",
  amount: 1500,
  sub_total: 1350,
  taxable: "yes",
  grand_total: 1552.5,
  discount: 150
}
✅ Save Invoice Response: { success: true, ... }
```

---

## How to Test

### Prerequisites

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Keep console open while testing

### Test Steps

1. **Navigate to Invoice Page**
   - Click "Invoice" in the sidebar

2. **Start Adding Invoice**
   - Click "Add Invoice" button
   - Select "Payable" type

3. **Step 1: Enter Entity Details**
   - Select an Entity (e.g., "John Doe - Employee")
   - Select Due Date
   - Click "Next"
   - ✅ Check console for logs

4. **Step 1.5: Add Items** ⭐
   - Enter Item Name: "Office Supplies"
   - Enter Quantity: 5
   - Enter Price: 100
   - Click "Add Item"
   - 📝 Console should show: `📝 Adding Item to Payable Invoice: {...}`
   - 📝 Console should show: `✅ Item added successfully! Total items: 1`
   - Repeat 2-3 more times for different items
   - Check the Items table below to verify items are displayed
   - Click "Next"

5. **Step 2: Review & Save** ⭐ API TESTING
   - View items in "Items Summary" table
   - Enter Discount: 100
   - Select Taxable: "Yes"
   - Grand Total should calculate automatically
   - Click "Save"
   - 📤 Console shows: `🚀 Starting Payable Invoice Creation...`
   - 📤 Console shows: `📋 Invoice Data Prepared: {...}`
   - 📤 Console shows: `📦 Creating 3 order items...`
   - 📤 For each item: `📤 Creating Order Item: {...}`
   - 📤 For each item: `✅ Create Order Item Response: {...}`
   - 📤 Console shows: `💾 Saving payable invoice...`
   - 📤 Console shows: `✅ Invoice saved to API successfully!`
   - 📤 Console shows: `✅ Payable invoice added to local state`
   - 📤 Console shows: `🎉 Payable Invoice Creation Completed Successfully!`

### Expected Console Output Examples

**Success Case:**

```javascript
// Step 1.5: Adding Items
📝 Adding Item to Payable Invoice: {itemName: "Supplies", quantity: 5, price: 100, total: 500, itemId: 1697123456789}
✅ Item added successfully! Total items: 1

// Step 2: Saving
🚀 Starting Payable Invoice Creation...
📋 Invoice Data Prepared: {voucher: "01", type: "Payable", ...}
📦 Creating 3 order items...
📤 Creating Order Item: {invoice: "01", item_name: "Supplies", qty: 5, price: 100, total: 500}
✅ Create Order Item Response: {success: true, message: "Order item created", ...}
💾 Saving payable invoice...
📤 Saving Payable Invoice: {invoice_no: "01", amount: 1500, ...}
✅ Save Invoice Response: {success: true, message: "Invoice saved", ...}
✅ Payable invoice added to local state: {...}
🎉 Payable Invoice Creation Completed Successfully!
```

**Error Case:**

```javascript
❌ Error saving payable invoice: Error: Failed to save payable invoice
```

---

## Modified Files

### 1. `/src/services/invoiceApi.js`

**Added Functions:**

- `savePayableInvoiceApi()` - Saves invoice to backend
- `createOrderItemApi()` - Creates a single order item
- `createOrderItemsApi()` - Creates multiple order items in sequence

### 2. `/src/components/pages/invoices/InvoicesPage.jsx`

**Changes:**

- Imported: `savePayableInvoiceApi`, `createOrderItemsApi`
- Updated `handlePayableStep2Submit()` to:
  - Call `createOrderItemsApi()` for all items
  - Call `savePayableInvoiceApi()` for invoice
  - Add comprehensive error handling
  - Add console logging at each step

### 3. `/src/components/generic/GenericModal.jsx`

**Changes:**

- Enhanced `handleAddItem()` with console logging
- Enhanced `handleSubmit()` with form data logging
- Added items table display in `payable-step2` modal

---

## Troubleshooting

### Issue: API returns error

**Solution**: Check the console error message and verify:

- Invoice number format (should be "01", "02", etc.)
- Item data structure (itemName, quantity, price, total)
- All required fields are present

### Issue: Items not appearing in table

**Solution**:

- Verify items were added (check console logs)
- Ensure items array is being passed to step 2
- Check if formData.items is populated

### Issue: No console logs showing

**Solution**:

- Open Developer Tools (F12)
- Go to Console tab
- Ensure no filters are hiding the logs
- Check for JavaScript errors

### Issue: CORS or network errors

**Solution**:

- Check if the API endpoint is accessible
- Verify network tab shows the POST requests
- Check API response status codes

---

## Console Log Reference

| Log                                   | When                      | Indicates                    |
| ------------------------------------- | ------------------------- | ---------------------------- |
| 📝 Adding Item                        | Item added in step 1.5    | Item validation and addition |
| ✅ Item added successfully            | Item successfully added   | Item count and state update  |
| 📤 Submitting Form Data               | Before form submission    | Final form data structure    |
| 🚀 Starting Payable Invoice Creation  | Step 2 submit start       | Process beginning            |
| 📋 Invoice Data Prepared              | Invoice object created    | Invoice structure ready      |
| 📦 Creating order items               | Before item API calls     | Starting item creation       |
| 📤 Creating Order Item                | Each item API call        | Individual item data         |
| ✅ Create Order Item Response         | Item API response         | API response data            |
| 💾 Saving payable invoice             | Before invoice API call   | Starting invoice save        |
| 📤 Saving Payable Invoice             | Sending invoice to API    | Invoice data being sent      |
| ✅ Save Invoice Response              | Invoice API response      | API response data            |
| ✅ Payable invoice added              | Item added to local state | Local state update           |
| 🎉 Payable Invoice Creation Completed | Process complete          | Success confirmation         |
| ❌ Error                              | Any error occurs          | Error details for debugging  |

---

## Notes

- All timestamps are automatically generated by the system
- Invoice numbers auto-increment (01, 02, 03, etc.)
- All monetary amounts are stored as numbers
- Tax calculation: 15% of subtotal when "Yes" is selected
- Discount is subtracted from amount before tax calculation
- Items are created in the API BEFORE the invoice is saved
- Proper error handling with user alerts on failure

---

## API Response Format

The backend is expected to return JSON with one of these formats:

**Success:**

```json
{
  "success": true,
  "message": "Invoice saved successfully",
  "data": { ... }
}
```

OR

```json
{
  "status": "success",
  "message": "Order item created",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error details here"
}
```

---

## Quick Summary

✅ **Implemented:**

- Three new API functions in `invoiceApi.js`
- Complete integration in `InvoicesPage.jsx`
- Enhanced logging in `GenericModal.jsx`
- Items table display in step 2
- Error handling and user feedback

✅ **API Calls Made:**

1. `POST /create_order.php` - For each item
2. `POST /save_order.php` - Once for the invoice

✅ **Testing:**

- Use browser console to monitor all operations
- Clear console logs for clean testing
- Check network tab to see actual API requests

---

For questions or issues, refer to the console logs which provide detailed information about each step of the process.
