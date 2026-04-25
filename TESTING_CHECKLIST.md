# Quick Testing Checklist - Payable Invoice with API Integration

## ✅ Pre-Test Setup

- [ ] Open the application
- [ ] Navigate to **Invoice** page
- [ ] Open **Developer Tools** (F12)
- [ ] Go to **Console** tab
- [ ] Keep console visible during testing

---

## 🧪 Test Scenario: Create Complete Payable Invoice with Items

### Step 1: Start Invoice Creation

- [ ] Click **"Add Invoice"** button (top right)
- [ ] Select **"Payable"** type
- [ ] **Console should log**: Basic mode information

### Step 2: Enter Entity Details (Payable-Step1)

- [ ] Select Entity: Choose any employee/vendor/customer
- [ ] Select Due Date: Pick any future date
- [ ] Click **"Next"**
- [ ] **Console should be clear** (no errors)

### Step 3: Add Items (Payable-Step1.5) ⭐

This is where we test item creation API preparation

#### Add First Item:

- [ ] Item Name: "Office Supplies"
- [ ] Quantity: 5
- [ ] Price: 100
- [ ] Click **"Add Item"**
- **✅ VERIFY IN CONSOLE:**
  ```
  📝 Adding Item to Payable Invoice: {
    itemName: "Office Supplies",
    quantity: 5,
    price: 100,
    total: 500,
    itemId: [timestamp]
  }
  ✅ Item added successfully! Total items: 1
  ```
- [ ] Item appears in table below

#### Add Second Item:

- [ ] Item Name: "Software License"
- [ ] Quantity: 2
- [ ] Price: 500
- [ ] Click **"Add Item"**
- **✅ VERIFY IN CONSOLE:**
  ```
  ✅ Item added successfully! Total items: 2
  ```
- [ ] Item appears in table

#### Add Third Item:

- [ ] Item Name: "Hardware"
- [ ] Quantity: 1
- [ ] Price: 1000
- [ ] Click **"Add Item"**
- **✅ VERIFY IN CONSOLE:**
  ```
  ✅ Item added successfully! Total items: 3
  ```
- [ ] Item appears in table
- [ ] All 3 items visible in table

#### Proceed to Next Step:

- [ ] Click **"Next"** button
- **✅ VERIFY IN CONSOLE:**
  ```
  📤 Submitting Form Data: {
    mode: "payable-step1.5",
    itemsCount: 3,
    itemsTotal: 3000,
    ...
  }
  ```

### Step 4: Finalize & Save Invoice (Payable-Step2) ⭐ API CALLS

This is where we test the actual API calls

#### Verify Items Summary:

- [ ] "Items Summary" table displays all 3 items
- [ ] Total amount shown: "3,000"

#### Fill Final Details:

- [ ] Discount: Enter "150" (for 5% discount calculation test)
- [ ] Taxable: Select "Yes"
- [ ] Sub Total should show: "2,850" (3000 - 150)
- [ ] Grand Total should show: "3,277.50" (2850 + 427.50 tax)

#### Submit Invoice:

- [ ] Click **"Save"** button
- **✅ VERIFY IN CONSOLE - START:**
  ```
  🚀 Starting Payable Invoice Creation...
  📋 Invoice Data Prepared: {
    voucher: "01",
    type: "Payable",
    amount: 3000,
    ...
    items: [... 3 items]
  }
  ```

#### API Call 1 - Creating Items:

- **✅ VERIFY IN CONSOLE:**

  ```
  📦 Creating 3 order items...

  📤 Creating Order Item: {
    invoice: "01",
    item_name: "Office Supplies",
    qty: 5,
    price: 100,
    total: 500
  }
  ✅ Create Order Item Response: {success: true, ...}

  📤 Creating Order Item: {
    invoice: "01",
    item_name: "Software License",
    qty: 2,
    price: 500,
    total: 1000
  }
  ✅ Create Order Item Response: {success: true, ...}

  📤 Creating Order Item: {
    invoice: "01",
    item_name: "Hardware",
    qty: 1,
    price: 1000,
    total: 1000
  }
  ✅ Create Order Item Response: {success: true, ...}
  ```

#### API Call 2 - Saving Invoice:

- **✅ VERIFY IN CONSOLE:**
  ```
  💾 Saving payable invoice...
  📤 Saving Payable Invoice: {
    invoice_no: "01",
    amount: 3000,
    sub_total: 2850,
    taxable: "yes",
    grand_total: 3277.5,
    discount: 150
  }
  ✅ Save Invoice Response: {success: true, ...}
  ```

#### Final Success:

- **✅ VERIFY IN CONSOLE:**
  ```
  ✅ Payable invoice added to local state
  🎉 Payable Invoice Creation Completed Successfully!
  ```
- [ ] Modal closes automatically
- [ ] New invoice appears in the table on the page

---

## 🔍 Network Verification

### Check Network Tab:

- [ ] Open **Network** tab in Developer Tools
- [ ] Go through the Save process again
- [ ] You should see 4 POST requests:
  1. POST to `/create_order.php` (item 1)
  2. POST to `/create_order.php` (item 2)
  3. POST to `/create_order.php` (item 3)
  4. POST to `/save_order.php` (invoice)
- [ ] All requests show **200** status code (or similar success)
- [ ] Response contains success indicators

---

## ⚠️ Error Testing (Optional)

### Test API Error Handling:

- [ ] Clear console
- [ ] Disconnect internet or block API endpoint
- [ ] Try to create payable invoice again
- **✅ VERIFY:**
  ```
  ❌ Error saving payable invoice: Error: ...
  ❌ Error creating order item: Error: ...
  ```
- [ ] User sees alert: "Failed to create payable invoice: ..."
- [ ] Modal stays open for retry

---

## 📋 Expected Input Values

### Recommended Test Data:

| Field        | Value             | Purpose                  |
| ------------ | ----------------- | ------------------------ |
| Entity       | Any employee      | Testing entity selection |
| Due Date     | Any future date   | Testing date handling    |
| Item 1 Name  | "Office Supplies" | Testing string input     |
| Item 1 Qty   | 5                 | Testing number input     |
| Item 1 Price | 100               | Testing calculation      |
| Item 2 Name  | "Hardware"        | Testing multiple items   |
| Item 2 Qty   | 2                 | Testing different qty    |
| Item 2 Price | 500               | Testing different prices |
| Discount     | 10                | Testing calculation      |
| Taxable      | Yes               | Testing tax calculation  |

---

## 🎯 Success Criteria

### All items created successfully:

- [ ] 3 POST requests to `/create_order.php`
- [ ] Each returns success response
- [ ] Console shows: `✅ Create Order Item Response`

### Invoice saved successfully:

- [ ] 1 POST request to `/save_order.php`
- [ ] Returns success response
- [ ] Console shows: `✅ Save Invoice Response`

### Complete success:

- [ ] Final log shows: `🎉 Payable Invoice Creation Completed Successfully!`
- [ ] Modal closes
- [ ] New invoice visible in table
- [ ] No errors in console

---

## 🚨 Common Issues & Solutions

| Issue                 | Console Log          | Solution                                 |
| --------------------- | -------------------- | ---------------------------------------- |
| Items not showing     | No 📝 log            | Check if "Add Item" button clicked       |
| API not called        | No 📤 log            | Check "Save" button has grandTotal value |
| Only 1st item created | 📤 shows 1 item only | Check items table had 3 items            |
| No success message    | No 🎉 log            | Check error log (❌) instead             |
| Modal doesn't close   | Modal open           | Check for JavaScript error               |

---

## 📸 Console Log Patterns to Expect

### Clean Sequence (Success):

```
🚀 Starting Payable Invoice Creation...
📋 Invoice Data Prepared: {...}
📦 Creating 3 order items...
📤 Creating Order Item: {...}
✅ Create Order Item Response: {...}
[Repeat for items 2 & 3]
💾 Saving payable invoice...
📤 Saving Payable Invoice: {...}
✅ Save Invoice Response: {...}
✅ Payable invoice added to local state: {...}
🎉 Payable Invoice Creation Completed Successfully!
```

### Error Pattern (Something Went Wrong):

```
🚀 Starting Payable Invoice Creation...
📋 Invoice Data Prepared: {...}
📦 Creating 3 order items...
❌ Error creating order items: Error: [Details]
❌ Error creating payable invoice: Error: [Details]
```

---

## ✅ Final Verification Checklist

After completing the full test:

- [ ] Console contains all expected logs
- [ ] No ❌ (error) logs present
- [ ] Network shows 4 successful POST requests
- [ ] Invoice appears in table on page
- [ ] All calculations correct (amount, discount, subtotal, tax, grand total)
- [ ] Invoice type shows as "Payable"
- [ ] Entity name shows correctly
- [ ] Date shows correctly
- [ ] Status shows as "Pending"

---

**🎉 If all checks pass, the API integration is working correctly!**

For detailed information, see `API_INTEGRATION_GUIDE.md`
