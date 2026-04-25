# API Quick Reference Guide

## All Invoice Fetching APIs

### API Endpoints Overview

```
Endpoint: POST /get_invoice.php
```

| Action                   | Purpose                       | Returns           |
| ------------------------ | ----------------------------- | ----------------- |
| `Receivable`             | Get all receivable invoices   | `Array<Invoice>`  |
| `Payable`                | Get all payable invoices      | `Array<Invoice>`  |
| `ALL`                    | Get all invoices (both types) | `Array<Invoice>`  |
| `invoice` + `invoice_no` | Get single invoice by ID      | `Invoice \| null` |

---

## Function Reference

### 1. fetchReceivableInvoicesApi()

```javascript
// Import
import { fetchReceivableInvoicesApi } from "@/services/invoiceApi";

// Usage
const invoices = await fetchReceivableInvoicesApi();

// Returns
Array<{
  id: number,
  invoice_no: string,        // e.g., "R-56521"
  type: "Receivable",
  amount: number,
  entity: string,
  date: string,
  status: string,
  // ... other fields
}>

// Error Handling
try {
  const data = await fetchReceivableInvoicesApi();
} catch (error) {
  console.error(error.message);
}

// Console Output
📥 Fetching Receivable Invoices...
✅ Receivable Invoices Fetched (245ms): [...]
```

---

### 2. fetchPayableInvoicesApi()

```javascript
// Import
import { fetchPayableInvoicesApi } from "@/services/invoiceApi";

// Usage
const invoices = await fetchPayableInvoicesApi();

// Returns
Array<{
  id: number,
  invoice_no: string,        // e.g., "P-38664"
  type: "Payable",
  amount: number,
  entity: string,
  date: string,
  status: string,
  // ... other fields
}>

// Error Handling
try {
  const data = await fetchPayableInvoicesApi();
} catch (error) {
  console.error(error.message);
}

// Console Output
📥 Fetching Payable Invoices...
✅ Payable Invoices Fetched (187ms): [...]
```

---

### 3. fetchAllInvoicesApi()

```javascript
// Import
import { fetchAllInvoicesApi } from "@/services/invoiceApi";

// Usage
const invoices = await fetchAllInvoicesApi();

// Returns (Mixed Array)
Array<{
  id: number,
  invoice_no: string,        // e.g., "R-56521" or "P-38664"
  type: "Receivable" | "Payable",
  amount: number,
  entity: string,
  date: string,
  status: string,
  // ... other fields
}>

// Error Handling
try {
  const data = await fetchAllInvoicesApi();
} catch (error) {
  console.error(error.message);
}

// Filter after fetching
const receivable = invoices.filter(inv => inv.type === "Receivable");
const payable = invoices.filter(inv => inv.type === "Payable");

// Console Output
📥 Fetching All Invoices (Receivable + Payable)...
✅ All Invoices Fetched (342ms): [...]
```

---

### 4. fetchInvoiceByIdApi(invoiceNo)

```javascript
// Import
import { fetchInvoiceByIdApi } from "@/services/invoiceApi";

// Parameters
invoiceNo: string  // e.g., "R-56521" or "P-38664"

// Usage
const invoice = await fetchInvoiceByIdApi("R-56521");
const invoice = await fetchInvoiceByIdApi("P-38664");

// Returns
{
  id: number,
  invoice_no: string,
  type: "Receivable" | "Payable",
  amount: number,
  entity: string,
  date: string,
  status: string,
  // ... other fields
} | null

// Error Handling
const invoice = await fetchInvoiceByIdApi("R-56521");
if (!invoice) {
  console.log("Invoice not found");
}

// Console Output
📥 Fetching Invoice by ID: R-56521
✅ Invoice Fetched (156ms): {...}
```

---

## Error Handling Examples

### Basic Error Handling

```javascript
try {
  const invoices = await fetchReceivableInvoicesApi();
  console.log(`Loaded ${invoices.length} invoices`);
} catch (error) {
  console.error("Failed to load invoices:", error.message);
}
```

### Detailed Error Handling

```javascript
const loadInvoices = async () => {
  try {
    const invoices = await fetchAllInvoicesApi();

    if (!invoices || invoices.length === 0) {
      console.warn("No invoices found");
      return [];
    }

    console.log(`Successfully loaded ${invoices.length} invoices`);
    return invoices;
  } catch (error) {
    console.error("Failed to load invoices:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Return fallback data
    return [];
  }
};
```

### With Retry Logic

```javascript
const retryApiCall = async (fn, maxRetries = 3, delayMs = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs *= 2; // Exponential backoff
    }
  }
};

// Usage
const invoices = await retryApiCall(() => fetchAllInvoicesApi());
```

---

## Console Output Reference

### Success Patterns

```
✅ Pattern 1: Receivable Invoices
📥 Fetching Receivable Invoices...
✅ Receivable Invoices Fetched (245ms): Array(2)

✅ Pattern 2: Payable Invoices
📥 Fetching Payable Invoices...
✅ Payable Invoices Fetched (187ms): Array(1)

✅ Pattern 3: All Invoices
📥 Fetching All Invoices (Receivable + Payable)...
✅ All Invoices Fetched (342ms): Array(3)

✅ Pattern 4: Single Invoice
📥 Fetching Invoice by ID: R-56521
✅ Invoice Fetched (156ms): Object
```

### Error Patterns

```
❌ Pattern 1: Network Error
❌ Error fetching receivable invoices (150ms): {
  message: "Network Error",
  status: 0,
  data: null
}

❌ Pattern 2: Server Error
❌ Error fetching payable invoices (120ms): {
  message: "Server Error",
  status: 500,
  data: {...}
}

❌ Pattern 3: Client Error
❌ Error fetching invoice R-99999 (110ms): {
  message: "Not Found",
  status: 404,
  data: null
}
```

### Warning Patterns

```
⚠️ Pattern 1: Empty Response
⚠️ No receivable invoices data found in response

⚠️ Pattern 2: No Data Found
⚠️ No invoices data found in response
```

---

## Usage in Components

### React Hook Pattern

```javascript
import { useEffect, useState } from "react";
import { fetchReceivableInvoicesApi } from "@/services/invoiceApi";

export function MyComponent() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchReceivableInvoicesApi();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {invoices.map((inv) => (
        <li key={inv.id}>
          {inv.invoice_no} - {inv.amount}
        </li>
      ))}
    </ul>
  );
}
```

### Using DataContext

```javascript
import { useContext, useEffect } from "react";
import { DataContext } from "@/context/DataContext";

export function MyComponent() {
  const { fetchPayableInvoicesApi } = useContext(DataContext);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPayableInvoicesApi();
      console.log("Payable invoices:", data);
    };
    load();
  }, []);

  return <div>Check console for invoices</div>;
}
```

---

## Response Format Support

The APIs automatically handle these response formats from backend:

```javascript
// Format 1: Explicit data field
{
  "success": true,
  "data": [
    { "invoice_no": "R-56521", "amount": 110 }
  ]
}

// Format 2: Invoices field
{
  "success": true,
  "invoices": [
    { "invoice_no": "R-56521", "amount": 110 }
  ]
}

// Format 3: Direct array
[
  { "invoice_no": "R-56521", "amount": 110 }
]

// All three formats return: Array<Invoice>
```

---

## Performance Tips

### 1. Use Type-Specific APIs

```javascript
// ❌ NOT OPTIMAL: Fetch all then filter
const all = await fetchAllInvoicesApi();
const receivable = all.filter((inv) => inv.type === "Receivable");

// ✅ BETTER: Fetch specific type
const receivable = await fetchReceivableInvoicesApi();
```

### 2. Cache Results

```javascript
let cachedInvoices = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedReceivable = async () => {
  if (cachedInvoices && Date.now() - cacheTime < CACHE_TTL) {
    return cachedInvoices;
  }
  cachedInvoices = await fetchReceivableInvoicesApi();
  cacheTime = Date.now();
  return cachedInvoices;
};
```

### 3. Batch Requests

```javascript
// ❌ SLOW: Sequential calls
const receivable = await fetchReceivableInvoicesApi();
const payable = await fetchPayableInvoicesApi();

// ✅ FAST: Parallel calls
const [receivable, payable] = await Promise.all([
  fetchReceivableInvoicesApi(),
  fetchPayableInvoicesApi(),
]);

// ✅ OR: Use single ALL endpoint
const all = await fetchAllInvoicesApi();
```

---

## Testing Checklist

- [ ] Test `fetchReceivableInvoicesApi()` returns Receivable invoices only
- [ ] Test `fetchPayableInvoicesApi()` returns Payable invoices only
- [ ] Test `fetchAllInvoicesApi()` returns both types
- [ ] Test `fetchInvoiceByIdApi()` with valid ID
- [ ] Test `fetchInvoiceByIdApi()` with invalid ID (returns null)
- [ ] Test error handling when API is down
- [ ] Test with empty response from backend
- [ ] Test console logging matches expected output
- [ ] Test different response formats work correctly
- [ ] Test performance (execution time logged)

---

## Common Issues & Solutions

| Problem              | Cause                       | Solution                        |
| -------------------- | --------------------------- | ------------------------------- |
| Empty array returned | No data in backend          | Check if invoices exist in DB   |
| Network error (0)    | API unreachable             | Verify endpoint URL is correct  |
| Error 500            | Backend crash               | Check server logs               |
| Wrong format error   | API response format changed | Update response format handling |
| Performance slow     | Large dataset               | Implement pagination            |
| Duplicate invoices   | Loading multiple times      | Add caching                     |
| Null response        | Missing invoice             | Check invoice ID is valid       |

---

## API Implementation Checklist

- ✅ Added `fetchReceivableInvoicesApi()` function
- ✅ Added `fetchPayableInvoicesApi()` function
- ✅ Added `fetchAllInvoicesApi()` function
- ✅ Added `fetchInvoiceByIdApi()` function
- ✅ Added to DataContext imports
- ✅ Added to DataContext provider value
- ✅ Added console logging at all steps
- ✅ Added error handling in all functions
- ✅ Added timing information
- ✅ Tested for syntax errors
- ✅ Documented response formats
- ✅ Provided usage examples

---

## Next Steps

1. **Test in Browser Console** - Verify all APIs work
2. **Monitor Network Tab** - Verify requests are sent
3. **Update InvoicesPage** - Use new APIs to load data
4. **Add UI Filters** - Let users select invoice type
5. **Implement Caching** - Improve performance
6. **Add Pagination** - Handle large datasets

---

## Links to Full Guides

- [Full Invoice Fetching Guide](INVOICE_FETCHING_GUIDE.md)
- [InvoicesPage Update Examples](INVOICES_PAGE_UPDATE_EXAMPLE.md)
- [API Integration Guide](API_INTEGRATION_GUIDE.md)
- [Testing Checklist](TESTING_CHECKLIST.md)

---

## Version History

- **v1.0** - Initial release with 4 API functions
- **v1.1** - Added error logging and timing
- **v1.2** - Added DataContext integration
- **v1.3** - Added comprehensive documentation

---

**Last Updated**: April 19, 2026
**Status**: ✅ Ready for Testing
