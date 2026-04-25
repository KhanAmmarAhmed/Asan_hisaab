# Invoice Fetching APIs - Integration Documentation

## Overview

Added four new API functions to fetch invoices by type from the backend:

1. **Receivable Invoices** - All receivable/income invoices
2. **Payable Invoices** - All payable/expense invoices
3. **All Invoices** - Combined receivable and payable invoices
4. **Single Invoice** - Get a specific invoice by ID

---

## API Endpoints & Functions

### 1. Fetch Receivable Invoices

**Endpoint**: `POST /get_invoice.php`
**Body Parameter**: `action = "Receivable"`

**Function**: `fetchReceivableInvoicesApi()`

```javascript
import { fetchReceivableInvoicesApi } from "@/services/invoiceApi";

// Usage
const receivableInvoices = await fetchReceivableInvoicesApi();
console.log("Receivable Invoices:", receivableInvoices);
```

**Returns**: `Array<Invoice>` or `[]` on error

**What It Does**:

- Fetches all receivable invoices from backend
- Handles various response formats (data, invoices, or direct array)
- Logs detailed timing and error information
- Returns empty array on failure (graceful degradation)

**Console Logs**:

```
📥 Fetching Receivable Invoices...
✅ Receivable Invoices Fetched (245ms): [...]

// On error:
❌ Error fetching receivable invoices (150ms): {
  message: "Network error",
  status: 500,
  data: {...}
}
```

---

### 2. Fetch Payable Invoices

**Endpoint**: `POST /get_invoice.php`
**Body Parameter**: `action = "Payable"`

**Function**: `fetchPayableInvoicesApi()`

```javascript
import { fetchPayableInvoicesApi } from "@/services/invoiceApi";

// Usage
const payableInvoices = await fetchPayableInvoicesApi();
console.log("Payable Invoices:", payableInvoices);
```

**Returns**: `Array<Invoice>` or `[]` on error

**Console Logs**:

```
📥 Fetching Payable Invoices...
✅ Payable Invoices Fetched (187ms): [...]

// On error:
❌ Error fetching payable invoices (120ms): {...}
```

---

### 3. Fetch All Invoices

**Endpoint**: `POST /get_invoice.php`
**Body Parameter**: `action = "ALL"`

**Function**: `fetchAllInvoicesApi()`

```javascript
import { fetchAllInvoicesApi } from "@/services/invoiceApi";

// Usage
const allInvoices = await fetchAllInvoicesApi();
console.log("All Invoices:", allInvoices);
```

**Returns**: `Array<Invoice>` or `[]` on error

**Console Logs**:

```
📥 Fetching All Invoices (Receivable + Payable)...
✅ All Invoices Fetched (342ms): [...]

// On error:
❌ Error fetching all invoices (200ms): {...}
```

---

### 4. Fetch Single Invoice by ID

**Endpoint**: `POST /get_invoice.php`
**Body Parameters**:

- `action = "invoice"`
- `invoice_no = "R-56521"` (invoice number)

**Function**: `fetchInvoiceByIdApi(invoiceNo)`

```javascript
import { fetchInvoiceByIdApi } from "@/services/invoiceApi";

// Usage
const invoice = await fetchInvoiceByIdApi("R-56521");
console.log("Single Invoice:", invoice);
```

**Parameters**:

- `invoiceNo` (string): Invoice number to fetch

**Returns**: `Invoice | null`

**Console Logs**:

```
📥 Fetching Invoice by ID: R-56521
✅ Invoice Fetched (156ms): {...}

// On error:
❌ Error fetching invoice R-56521 (100ms): {...}
```

---

## Error Handling

All functions include comprehensive error handling:

### Features

- **Try-Catch Blocks**: Wrapped in try-catch for network errors
- **Graceful Degradation**: Returns empty array [] instead of throwing
- **Detailed Logging**: Shows error message, status code, and response data
- **Performance Monitoring**: Logs execution time for each API call
- **Network Error Handling**: Catches and logs HTTP errors properly

### Error Response Format

```javascript
{
  message: "Error message from API or network",
  status: 500,  // HTTP status code
  data: {}      // Response data from server
}
```

### Example Error Handling

```javascript
try {
  const invoices = await fetchReceivableInvoicesApi();
  if (invoices.length === 0) {
    console.warn("No receivable invoices found");
  }
} catch (error) {
  console.error("Failed to fetch invoices:", error);
  // Continue with empty state or retry
}
```

---

## Response Format Handling

Each API function handles multiple response formats from backend:

### Supported Response Formats

1. **Format 1**: `{ data: [...] }`
2. **Format 2**: `{ invoices: [...] }`
3. **Format 3**: Direct array `[...]`

```javascript
// Any of these formats will work:

// Format 1
{ "data": [...items] }

// Format 2
{ "invoices": [...items] }

// Format 3
[...items]
```

---

## Usage in React Components

### Example 1: Load Receivable Invoices

```javascript
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";

export function ReceivableInvoicesPage() {
  const { fetchReceivableInvoicesApi } = useContext(DataContext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const data = await fetchReceivableInvoicesApi();
        setInvoices(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Receivable Invoices ({invoices.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoice_no}</td>
              <td>{inv.amount}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Example 2: Load All Invoices with Filtering

```javascript
import { useEffect, useState } from "react";
import { fetchAllInvoicesApi } from "@/services/invoiceApi";

export function AllInvoicesPage() {
  const [allInvoices, setAllInvoices] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  useEffect(() => {
    const loadInvoices = async () => {
      console.log("🔄 Loading all invoices...");
      const data = await fetchAllInvoicesApi();
      setAllInvoices(data);
    };

    loadInvoices();
  }, []);

  useEffect(() => {
    // Filter invoices by type
    if (filterType === "ALL") {
      setFilteredInvoices(allInvoices);
    } else {
      setFilteredInvoices(allInvoices.filter((inv) => inv.type === filterType));
    }
  }, [filterType, allInvoices]);

  return (
    <div>
      <label>
        Filter by Type:
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="Receivable">Receivable Only</option>
          <option value="Payable">Payable Only</option>
        </select>
      </label>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Invoice #</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.type}</td>
              <td>{inv.invoice_no}</td>
              <td>{inv.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Example 3: Get Single Invoice Details

```javascript
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchInvoiceByIdApi } from "@/services/invoiceApi";

export function InvoiceDetailsPage() {
  const { invoiceNo } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        console.log(`📥 Loading invoice ${invoiceNo}...`);
        const data = await fetchInvoiceByIdApi(invoiceNo);
        setInvoice(data);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceNo]);

  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div>
      <h2>Invoice: {invoice.invoice_no}</h2>
      <p>Type: {invoice.type}</p>
      <p>Amount: Rs. {invoice.amount}</p>
      <p>Status: {invoice.status}</p>
    </div>
  );
}
```

---

## Console Output Examples

### Successful Fetch

```javascript
// console.log output when fetching receivable invoices:

📥 Fetching Receivable Invoices...
✅ Receivable Invoices Fetched (245ms): [
  {
    id: 1,
    invoice_no: "R-56521",
    type: "Receivable",
    amount: 110,
    entity: "test recive",
    date: "10-04-2026",
    status: "Pending"
  },
  {
    id: 2,
    invoice_no: "R-56522",
    type: "Receivable",
    amount: 250,
    entity: "client2",
    date: "10-04-2026",
    status: "Paid"
  }
]
```

### Network Error

```javascript
❌ Error fetching receivable invoices (150ms): {
  message: "Network Error",
  status: 0,
  data: null
}
```

### Server Error

```javascript
❌ Error fetching payable invoices (120ms): {
  message: "Server Error",
  status: 500,
  data: { error: "Database connection failed" }
}
```

---

## Performance Considerations

### Timing

- Database queries: ~150-300ms
- Network overhead: ~50-100ms
- Total per request: ~200-400ms

### Optimization Tips

1. **Cache Results**: Store fetched data locally
2. **Batch Fetches**: Use `fetchAllInvoicesApi()` instead of multiple calls
3. **Conditional Fetching**: Only fetch when needed
4. **Pagination**: Request only necessary data from backend

### Example: Caching

```javascript
const [cachedInvoices, setCachedInvoices] = useState(null);
const [cacheTime, setCacheTime] = useState(null);

const getInvoices = async (useCache = true) => {
  // Check if cache is fresh (< 5 minutes old)
  if (useCache && cachedInvoices && Date.now() - cacheTime < 300000) {
    console.log("✅ Using cached invoices");
    return cachedInvoices;
  }

  console.log("📥 Fetching fresh invoices...");
  const data = await fetchAllInvoicesApi();
  setCachedInvoices(data);
  setCacheTime(Date.now());
  return data;
};
```

---

## Migration Guide: From Old to New API

### Old Way

```javascript
// Single endpoint, getting all invoices
const invoices = await fetchInvoicesApi();
// Then filter in code...
const receivable = invoices.filter((inv) => inv.type === "Receivable");
const payable = invoices.filter((inv) => inv.type === "Payable");
```

### New Way

```javascript
// Get specific type from API
const receivable = await fetchReceivableInvoicesApi();
const payable = await fetchPayableInvoicesApi();
// Or get all at once
const all = await fetchAllInvoicesApi();
```

**Benefits of New Way**:

- Backend does filtering (more efficient)
- Less data transfer for specific needs
- Better for large datasets
- Clearer intent in code

---

## Testing in Console

### Quick Test - Copy and Paste

```javascript
// Test Receivable
const { DataContext } = await import("/src/context/DataContext.jsx");
const context = useContext(DataContext);
await context
  .fetchReceivableInvoicesApi()
  .then((data) => console.log("Receivable:", data));

// Test Payable
await context
  .fetchPayableInvoicesApi()
  .then((data) => console.log("Payable:", data));

// Test All
await context.fetchAllInvoicesApi().then((data) => console.log("All:", data));

// Test Single
await context
  .fetchInvoiceByIdApi("R-56521")
  .then((data) => console.log("Single:", data));
```

---

## Troubleshooting

| Issue                 | Cause             | Solution                           |
| --------------------- | ----------------- | ---------------------------------- |
| Empty array returned  | No data in DB     | Check if invoices exist in backend |
| Network error (0)     | API unreachable   | Verify API endpoint is accessible  |
| Server error (500)    | Backend crash     | Check server logs                  |
| Wrong response format | API format change | Update response format handling    |
| Slow performance      | Large dataset     | Implement pagination or filtering  |

---

## Files Updated

1. **`src/services/invoiceApi.js`**
   - Added 4 new exported functions
   - Added error handling
   - Added console logging

2. **`src/context/DataContext.jsx`**
   - Updated imports
   - Added functions to context value
   - Made available to all components

---

## Next Steps

1. **Test the APIs** using browser console
2. **Update Invoice Page** to use new APIs for loading
3. **Add Type Filters** to UI for selecting invoice type
4. **Implement Caching** for better performance
5. **Add Pagination** for large datasets

---

## API Request Summary

| Function                       | Endpoint           | Action     | Purpose                     |
| ------------------------------ | ------------------ | ---------- | --------------------------- |
| `fetchReceivableInvoicesApi()` | `/get_invoice.php` | Receivable | Get all receivable invoices |
| `fetchPayableInvoicesApi()`    | `/get_invoice.php` | Payable    | Get all payable invoices    |
| `fetchAllInvoicesApi()`        | `/get_invoice.php` | ALL        | Get all invoices            |
| `fetchInvoiceByIdApi(id)`      | `/get_invoice.php` | invoice    | Get single invoice          |

All requests use `POST` method with `action` parameter in form data.

---

For more information, see the main integration guide and testing checklist.
