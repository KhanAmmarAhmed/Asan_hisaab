# Invoice Fetching APIs - Testing Guide

## Quick Start Testing

### Step 1: Open Browser Console

```
Press: F12 on Windows/Linux or Cmd+Option+I on Mac
Go to: Console tab
```

### Step 2: Navigate to a Component Using DataContext

You can test directly from any page that uses DataContext, or open the Invoice page.

### Step 3: Import and Test

#### Test 1: Fetch Receivable Invoices

```javascript
// Copy and paste into console
const ctx = window.__dataContext; // If exposed
// OR manually create test:
(async () => {
  try {
    console.log("📥 Testing Receivable API...");
    const response = await fetch("/get_invoice.php", {
      method: "POST",
      body: (() => {
        const fd = new FormData();
        fd.append("action", "Receivable");
        return fd;
      })(),
    });
    const data = await response.json();
    console.log("✅ Response:", data);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
```

#### Test 2: Fetch Payable Invoices

```javascript
(async () => {
  try {
    console.log("📥 Testing Payable API...");
    const response = await fetch("/get_invoice.php", {
      method: "POST",
      body: (() => {
        const fd = new FormData();
        fd.append("action", "Payable");
        return fd;
      })(),
    });
    const data = await response.json();
    console.log("✅ Response:", data);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
```

#### Test 3: Fetch All Invoices

```javascript
(async () => {
  try {
    console.log("📥 Testing All Invoices API...");
    const response = await fetch("/get_invoice.php", {
      method: "POST",
      body: (() => {
        const fd = new FormData();
        fd.append("action", "ALL");
        return fd;
      })(),
    });
    const data = await response.json();
    console.log("✅ Response:", data);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
```

#### Test 4: Fetch Single Invoice

```javascript
(async () => {
  try {
    console.log("📥 Testing Single Invoice API...");
    const response = await fetch("/get_invoice.php", {
      method: "POST",
      body: (() => {
        const fd = new FormData();
        fd.append("action", "invoice");
        fd.append("invoice_no", "R-56521"); // Replace with actual invoice number
        return fd;
      })(),
    });
    const data = await response.json();
    console.log("✅ Response:", data);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
```

---

## Expected Results

### Success Response - Receivable

```javascript
// Console Output:
📥 Testing Receivable API...
✅ Response: {
  success: true,
  data: Array(2)
  [
    {
      id: 1,
      invoice_no: "R-56521",
      type: "Receivable",
      entity: "test recive",
      amount: 110,
      discount: 10,
      sub_total: 110,
      taxable: "YES",
      grand_total: 100,
      date: "10-04-2026",
      status: "Pending"
    },
    {
      id: 2,
      invoice_no: "R-56522",
      type: "Receivable",
      entity: "client2",
      amount: 250,
      discount: 0,
      sub_total: 250,
      taxable: "NO",
      grand_total: 250,
      date: "11-04-2026",
      status: "Paid"
    }
  ]
}
```

### Success Response - Payable

```javascript
📥 Testing Payable API...
✅ Response: {
  success: true,
  data: Array(1)
  [
    {
      id: 3,
      invoice_no: "P-38664",
      type: "Payable",
      entity: "supplier",
      amount: 1200,
      discount: 100,
      sub_total: 1100,
      taxable: "YES",
      grand_total: 1265,
      date: "12-04-2026",
      status: "Pending"
    }
  ]
}
```

### Success Response - All

```javascript
📥 Testing All Invoices API...
✅ Response: {
  success: true,
  data: Array(3)
  [
    // Receivable invoices...
    {
      id: 1,
      invoice_no: "R-56521",
      type: "Receivable",
      // ...
    },
    // Payable invoices...
    {
      id: 3,
      invoice_no: "P-38664",
      type: "Payable",
      // ...
    }
  ]
}
```

### Success Response - Single Invoice

```javascript
📥 Testing Single Invoice API...
✅ Response: {
  success: true,
  data: {
    id: 1,
    invoice_no: "R-56521",
    type: "Receivable",
    entity: "test recive",
    amount: 110,
    discount: 10,
    sub_total: 110,
    taxable: "YES",
    grand_total: 100,
    date: "10-04-2026",
    status: "Pending"
  }
}
```

---

## Error Testing

### Test Network Error

```javascript
// Disconnect internet, then run:
(async () => {
  try {
    const response = await fetch(
      "https://fisdemoprojects.com/assanhisaab/get_invoice.php",
      {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          fd.append("action", "ALL");
          return fd;
        })(),
      },
    );
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("❌ Network Error Expected:", err.message);
    // Output: "❌ Network Error Expected: Failed to fetch"
  }
})();
```

### Test Server Error (500)

If backend returns 500 error:

```javascript
❌ Server Error:
{
  success: false,
  error: "Database connection failed"
}
```

### Test Not Found (404)

If invoice doesn't exist:

```javascript
❌ Invoice Not Found:
{
  success: false,
  error: "Invoice not found"
}
```

---

## Component Integration Testing

### Test in React Component

Create this test component:

```javascript
// TestInvoiceApis.jsx
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import { Button, Box, Typography, Table } from "@mui/material";

export default function TestInvoiceApis() {
  const {
    fetchReceivableInvoicesApi,
    fetchPayableInvoicesApi,
    fetchAllInvoicesApi,
    fetchInvoiceByIdApi,
  } = useContext(DataContext);

  const [results, setResults] = useState({
    receivable: null,
    payable: null,
    all: null,
    single: null,
  });

  const [loading, setLoading] = useState(false);

  const testAll = async () => {
    try {
      setLoading(true);
      console.log("🧪 Starting API Tests...");

      // Test 1
      const receivable = await fetchReceivableInvoicesApi();
      console.log("✅ Receivable:", receivable);
      setResults((prev) => ({ ...prev, receivable }));

      // Test 2
      const payable = await fetchPayableInvoicesApi();
      console.log("✅ Payable:", payable);
      setResults((prev) => ({ ...prev, payable }));

      // Test 3
      const all = await fetchAllInvoicesApi();
      console.log("✅ All:", all);
      setResults((prev) => ({ ...prev, all }));

      // Test 4
      const single = await fetchInvoiceByIdApi("R-56521");
      console.log("✅ Single:", single);
      setResults((prev) => ({ ...prev, single }));

      console.log("🎉 All Tests Completed!");
    } catch (error) {
      console.error("❌ Test Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Invoice Fetching API Tests
      </Typography>

      <Button
        variant="contained"
        onClick={testAll}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? "Testing..." : "Run All Tests"}
      </Button>

      {results.receivable && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            Receivable Invoices ({results.receivable.length})
          </Typography>
          <pre>{JSON.stringify(results.receivable, null, 2)}</pre>
        </Box>
      )}

      {results.payable && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            Payable Invoices ({results.payable.length})
          </Typography>
          <pre>{JSON.stringify(results.payable, null, 2)}</pre>
        </Box>
      )}

      {results.all && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            All Invoices ({results.all.length})
          </Typography>
          <pre>{JSON.stringify(results.all, null, 2)}</pre>
        </Box>
      )}

      {results.single && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Single Invoice</Typography>
          <pre>{JSON.stringify(results.single, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}
```

---

## Verification Checklist

### Console Logging

- [ ] `fetchReceivableInvoicesApi()` logs `📥 Fetching Receivable Invoices...`
- [ ] `fetchPayableInvoicesApi()` logs `📥 Fetching Payable Invoices...`
- [ ] `fetchAllInvoicesApi()` logs `📥 Fetching All Invoices...`
- [ ] `fetchInvoiceByIdApi()` logs `📥 Fetching Invoice by ID...`
- [ ] Success logs show execution time
- [ ] Error logs show status code and error details

### Network Requests

- [ ] Network tab shows POST request to `/get_invoice.php`
- [ ] Request body contains correct `action` parameter
- [ ] Response status is 200 (success)
- [ ] Response type is JSON

### Response Data

- [ ] Receivable API returns only Receivable type invoices
- [ ] Payable API returns only Payable type invoices
- [ ] All API returns both types mixed
- [ ] Single API returns one invoice object or null

### Error Handling

- [ ] API returns empty array `[]` on error (not throwing)
- [ ] Error is logged to console with timing
- [ ] No unhandled promise rejections
- [ ] Component doesn't crash on API failure

### Data Integrity

- [ ] Invoice numbers are not duplicated
- [ ] Amounts are numbers, not strings
- [ ] Dates are properly formatted
- [ ] Required fields are present

---

## Debugging Tips

### Check if API is Reachable

```javascript
fetch("https://fisdemoprojects.com/assanhisaab/get_invoice.php")
  .then((r) => console.log("📡 API Reachable", r.status))
  .catch((e) => console.error("❌ API Unreachable", e));
```

### Monitor Network Tab Requests

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Run API test
4. Look for requests to `/get_invoice.php`
5. Click request → Response tab to see returned data

### Check Response Format

```javascript
(async () => {
  const res = await fetch(...);
  const data = await res.json();
  console.log("Type:", typeof data);
  console.log("Has data?", Array.isArray(data.data));
  console.log("Has invoices?", Array.isArray(data.invoices));
  console.log("Is array?", Array.isArray(data));
})();
```

### Profile Performance

```javascript
console.time("Fetch Receivable");
const invoices = await fetchReceivableInvoicesApi();
console.timeEnd("Fetch Receivable");
// Output: "Fetch Receivable: 245.5ms"
```

---

## Common Test Scenarios

### Scenario 1: No Invoices in Database

**Expected Behavior:**

```javascript
✅ Receivable Invoices Fetched (150ms): []
// Returns empty array, no error
```

### Scenario 2: Large Dataset (1000+ invoices)

**Expected Behavior:**

```javascript
✅ All Invoices Fetched (1200ms): Array(1000)
// Takes longer (1-2 seconds) but still works
```

### Scenario 3: Database Down

**Expected Behavior:**

```javascript
❌ Error fetching all invoices (50ms): {
  message: "Server Error",
  status: 500,
  data: null
}
// Returns empty array instead of throwing
```

### Scenario 4: Invalid Invoice ID

**Expected Behavior:**

```javascript
✅ Invoice Fetched (100ms): null
// Returns null instead of throwing error
```

---

## Performance Benchmarks

### Expected Times (with good network)

| API                   | Time      | Status |
| --------------------- | --------- | ------ |
| Receivable (10 items) | 150-250ms | ✅     |
| Payable (10 items)    | 150-250ms | ✅     |
| All (20 items)        | 200-350ms | ✅     |
| Single                | 100-200ms | ✅     |

### Slow Performance Indicators

| Time       | Status       | Action               |
| ---------- | ------------ | -------------------- |
| < 500ms    | ✅ Good      | OK                   |
| 500-1000ms | ⚠️ Slow      | Check dataset size   |
| > 1000ms   | ❌ Very Slow | Implement pagination |

---

## Troubleshooting Guide

### Problem: Empty Array Always Returned

**Check 1: Is endpoint correct?**

```javascript
console.log("Endpoint:", "/get_invoice.php");
```

**Check 2: Is parameter correct?**

```javascript
const fd = new FormData();
fd.append("action", "Receivable"); // Not "Receivables" or other variants
```

**Check 3: Does data exist in database?**

- Use DB admin panel to verify invoices exist
- Check invoice types match (Receivable vs Payable)

### Problem: Network Error 0

**Solution 1: Check URL**

```javascript
// ✅ Correct
const res = await fetch("/get_invoice.php", {...});

// ❌ Wrong
const res = await fetch("get_invoice.php", {...});
const res = await fetch("http://localhost/get_invoice.php", {...});
```

**Solution 2: Check CORS**

```javascript
// If API is on different domain, check CORS headers
fetch("/get_invoice.php", {
  method: "POST",
  credentials: "include", // For cookies
});
```

### Problem: 404 Not Found

**Solution 1: Verify endpoint exists**

```javascript
// Ask developer if endpoint URL is correct
// Or check .htaccess rewrite rules
```

**Solution 2: Check request method**

```javascript
// Must be POST, not GET
method: "POST"; // Not GET
```

### Problem: JSON Parse Error

**Solution: Check if response is JSON**

```javascript
const res = await fetch(...);
const text = await res.text();
console.log("Response type:", typeof text);
console.log("First 100 chars:", text.substring(0, 100));

// Then parse if it looks like JSON
if (text.startsWith('{') || text.startsWith('[')) {
  const data = JSON.parse(text);
}
```

---

## Final Checklist

Before considering testing complete:

- [ ] All 4 APIs respond with data
- [ ] Console logs show correct timing
- [ ] Network requests complete successfully
- [ ] Error handling works (doesn't crash)
- [ ] Empty responses handled gracefully
- [ ] Response data format is correct
- [ ] Performance is acceptable
- [ ] No unhandled promise rejections
- [ ] DataContext integration works
- [ ] Component rendering works with data

✅ **Ready to integrate into production!**

---

## Next Steps

1. **Fix any issues** found during testing
2. **Optimize queries** if performance is slow
3. **Integrate into InvoicesPage** per guidelines
4. **Add UI for type filtering** (Receivable/Payable/All)
5. **Implement caching** for better performance
6. **Monitor production** usage patterns

---

**Happy Testing! 🧪✅**
