# Payable Invoice API Integration - Complete Implementation Guide

## Overview

This document describes the complete implementation of the payable invoice creation flow, which integrates with three API endpoints across a multi-step modal process.

## API Endpoints

### 1. Create Order - `/create_order.php`

**Purpose:** Initialize a new order and obtain an invoice number.

**Method:** POST  
**Action:** `Payable` or `Receivable`

**Request:**

```
action: "Payable"
entity: "vendor_name" (or customer/employee name)
date: "12-04-2026" (Due date)
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "10",
    "invoice": "P-23429",
    "entity_name": "Vendor Name",
    "type": "Payable"
  }
}
```

**Implementation:** `createOrderApi()` in `src/services/invoiceApi.js`

---

### 2. Save Order Items - `/save_order.php`

**Purpose:** Add line items to an existing order.

**Method:** POST  
**Action:** `order`

**Request:**

```
action: "order"
invoice: "P-23429" (from create_order response)
item_name: "item name"
qty: 1
price: 10.00
total: 10.00
```

**Response:**

```json
{
  "success": true,
  "message": "Order added successfully",
  "data": {
    "order": {
      "id": "10",
      "invoice": "P-23429",
      "entity_name": "test",
      "type": "Payable",
      "total": null
    },
    "order_items": {
      "1": {
        "id": "7",
        "order_id": "10",
        "item_name": "item",
        "qty": "1",
        "price": "10.00",
        "total": "10.00"
      }
    }
  }
}
```

**Implementation:** `createOrderItemApi()` + `createOrderItemsApi()` in `src/services/invoiceApi.js`

---

### 3. Save Payable Details - `/save_order.php`

**Purpose:** Finalize the order with payable invoice details and calculations.

**Method:** POST  
**Action:** `save_invoice`

**Request:**

```
action: "save_invoice"
invoice_no: "P-23429"
amount: 1200.00 (total from items)
sub_total: 1200.00 (amount - discount)
taxable: "yes" or "no"
grand_total: 1100.00 (sub_total + tax - discount)
discount: 10.00
```

**Response:**

```json
{
  "success": true,
  "message": "Order added successfully",
  "data": {
    "order": {
      "id": "10",
      "invoice": "P-23429",
      "entity_name": "test",
      "type": "Payable",
      "total": "10.00"
    },
    "order_items": {
      "1": {
        "id": "7",
        "order_id": "10",
        "item_name": "item",
        "qty": "1",
        "price": "10.00",
        "total": "10.00"
      }
    },
    "Payable_details": {
      "1": {
        "id": "6",
        "invoice_no": "P-23429",
        "order_id": "10",
        "amount": "1200.00",
        "discount": "10.00",
        "sub_total": "1200.00",
        "taxable": "yes",
        "grand_total": "1100.00",
        "type": "Payable"
      }
    }
  }
}
```

**Implementation:** `savePayableInvoiceApi()` in `src/services/invoiceApi.js`

---

## Modal Flow - Step by Step

### Step 1: Payable Invoice Selection

**Modal Mode:** `payable-step1`  
**Component:** GenericModal (InvoicesPage.jsx)

**User Actions:**

1. Click "Add Invoice" button
2. Select "Payable" from invoice type selection
3. Enter Entity Name (dropdown: Customers, Employees, Vendors)
4. Enter Due Date
5. Click "Next" button

**Handler:** `handlePayableStep1Submit()`

**Implementation Details:**

```javascript
// Calls create_order.php
const orderResponse = await createOrderApi({
  type: "Payable",
  entity: selectedEntity,
  dueDate: dueDate,
});

// Stores response in payableData state:
// - invoiceNo: "P-23429"
// - orderId: "10"
// - orderType: "Payable"
// - entityName, entityCategory, dueDate

// Transitions to: payable-step1.5
```

**Data Flow:**

- Input: Entity name, Due date
- API Call: `create_order.php` (POST)
- Output: Invoice number, Order ID
- State: payableData updated with invoice details

---

### Step 1.5: Add Order Items

**Modal Mode:** `payable-step1.5`  
**Component:** GenericModal (InvoicesPage.jsx)

**User Actions:**

1. View entity and date from Step 1
2. Enter Item Name
3. Enter Quantity
4. Enter Price per unit
5. Click "Add Item"
6. Repeat for multiple items
7. View items in table
8. Click "Next" button

**Handler:** `handlePayableStep1_5Submit()`

**Implementation Details:**

```javascript
// Saves items via save_order.php with action=order
for each item:
  await createOrderItemApi({
    invoiceNo: payableData.invoiceNo,
    itemName: item.itemName,
    quantity: item.quantity,
    price: item.price,
    total: item.total
  });

// Updates payableData with items array
// Transitions to: payable-step2
```

**Data Flow:**

- Input: Item details (name, qty, price)
- API Call: `save_order.php` with action=order (multiple POST)
- Output: Order items added (stored in backend)
- State: payableData.items array updated
- Calculation: Automatic total = qty × price

---

### Step 2: Payable Invoice Details & Summary

**Modal Mode:** `payable-step2`  
**Component:** GenericModal (InvoicesPage.jsx)

**Display:**

1. Items Summary Table (read-only)
   - Item Name
   - Quantity
   - Price
   - Total

2. Invoice Summary Fields
   - Amount (read-only from items total)
   - Discount percentage (editable)
   - Sub Total (calculated: amount - discount)
   - Taxable (dropdown: Yes/No)
   - Grand Total (calculated from above)

**User Actions:**

1. Review items summary
2. Enter discount percentage
3. Select taxable status (Yes/No)
4. Auto-calculated: Sub Total and Grand Total
5. Click "Save" button
6. OR Click "Preview" button

**Handler:** `handlePayableStep2Submit()`

**Implementation Details:**

```javascript
// Step 2a: Save payable details via save_order.php
const saveResult = await savePayableInvoiceApi({
  voucher: payableData.invoiceNo,
  amount: itemsTotal,
  discount: discountPercentage,
  subTotal: amount - discount,
  taxAble: "Yes" or "No",
  grandTotal: subTotal + tax
});

// Step 2b: Add invoice to local database
const newEntry = {
  voucher: payableData.invoiceNo,
  type: "Payable",
  amount, discount, subTotal, taxAble, grandTotal,
  entityType, entity, date,
  reference, status, items
};
await addInvoiceApi(newEntry);

// Modal closes
// Returns to invoice list (table view)
```

**Data Flow:**

- Input: Discount %, Taxable status
- Calculations: Sub Total, Grand Total (15% tax if taxable)
- API Calls:
  1. `save_order.php` with action=save_invoice (POST)
  2. `invoice_api.php` with action=add (POST)
- Output: Invoice created with complete details
- State: payableData reset, invoice visible in table

---

## State Management

### payableData Object Structure

```javascript
{
  invoiceNo: "P-23429",        // From create_order.php
  orderId: "10",               // From create_order.php
  orderType: "Payable",        // From create_order.php
  entityName: "Vendor Name",   // From step 1
  entityCategory: "vendor",    // From step 1 (customer/employee/vendor)
  dueDate: "2026-04-20",       // From step 1
  items: [                      // From step 1.5
    {
      itemName: "item1",
      quantity: 1,
      price: 10.00,
      total: 10.00,
      id: timestamp
    },
    // more items...
  ],
  description: "",             // Optional
  category: "",               // Optional
  subCategory: ""             // Optional
}
```

### Data Flow Through Steps

```
Step 1: create_order.php response
  ↓
  payableData = {
    entityName, entityCategory, dueDate,
    invoiceNo, orderId, orderType
  }
  ↓
Step 1.5: save_order.php (action=order) for each item
  ↓
  payableData.items = [...]
  ↓
Step 2: save_order.php (action=save_invoice)
  ↓
  Local DB: invoice with all details
  ↓
Invoice Table Display
```

---

## Error Handling

Each step includes try-catch error handling:

### Step 1 Errors

- Missing entity or date
- API connection errors
- Invalid invoice number in response

### Step 1.5 Errors

- Missing item details
- API errors creating items
- Network timeouts

### Step 2 Errors

- Missing discount or tax info
- API errors saving details
- Local DB write failures

All errors display user-friendly alert messages and log detailed console errors for debugging.

---

## Files Modified

1. **src/services/invoiceApi.js**
   - Added `createOrderApi()` - calls create_order.php
   - Fixed `createOrderItemApi()` - calls save_order.php (action=order)
   - Existing `savePayableInvoiceApi()` - calls save_order.php (action=save_invoice)
   - Existing `createOrderItemsApi()` - batch wrapper

2. **src/components/pages/invoices/InvoicesPage.jsx**
   - Imported `createOrderApi`
   - Updated `handlePayableStep1Submit()` - now async, calls createOrderApi
   - Updated `handlePayableStep1_5Submit()` - now async, calls createOrderItemsApi
   - Updated `handlePayableStep2Submit()` - now async, uses invoiceNo from step 1

3. **src/components/generic/GenericModal.jsx**
   - No changes needed (already supports all modal modes)

---

## Testing Checklist

- [ ] Create payable invoice with valid entity and date
- [ ] Verify invoice number returned and stored correctly
- [ ] Add multiple items and verify all saved
- [ ] Calculate discount and tax correctly
- [ ] Verify final invoice appears in invoice table
- [ ] Test error scenarios (missing fields, API failures)
- [ ] Verify data persistence across steps
- [ ] Test back button functionality
- [ ] Verify invoice details match frontend and backend

---

## Console Logging

The implementation includes detailed console logging for debugging:

```
📤 Creating Order via create_order.php
✅ Order Created Successfully
📝 Payable data updated with invoice
📤 Creating Multiple Order Items for Invoice
✅ All Order Items Created
💾 Saving payable order details
✅ Payable details saved to API
🎉 Payable Invoice Creation Completed Successfully!
```

Each step uses emoji prefixes for easy identification:

- 📤 API request
- ✅ Success
- ❌ Error
- 📝 Data update
- 💾 Saving
- 🎉 Completion
