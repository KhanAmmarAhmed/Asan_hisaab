# InvoicesPage Update Example - Using New Invoice APIs

This document shows how to update the InvoicesPage to use the new invoice fetching APIs.

## Current Implementation

The current InvoicesPage uses local state for invoices. Here's how to integrate the new APIs.

## Option 1: Simple Integration (Recommended for Start)

Add this effect to load invoices from API when page loads:

```javascript
import { useContext, useEffect } from "react";
import { DataContext } from "@/context/DataContext";

export default function InvoicesPage() {
  const {
    invoices,
    setInvoices,
    fetchAllInvoicesApi,
    fetchReceivableInvoicesApi,
    fetchPayableInvoicesApi,
  } = useContext(DataContext);

  // Load invoices on component mount
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        console.log("📥 Loading invoices from API...");
        const apiInvoices = await fetchAllInvoicesApi();

        if (apiInvoices && apiInvoices.length > 0) {
          console.log(`✅ Loaded ${apiInvoices.length} invoices from API`);
          setInvoices(apiInvoices);
        } else {
          console.warn("⚠️ No invoices found in API, using local invoices");
        }
      } catch (error) {
        console.error("❌ Error loading invoices:", error);
        // Fall back to local invoices
      }
    };

    loadInvoices();
  }, []);

  // Rest of your component code...
  return (
    // Your JSX here
  );
}
```

## Option 2: Advanced Integration (With Type Selection)

Add ability to filter by invoice type:

```javascript
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";

export default function InvoicesPage() {
  const {
    invoices,
    addInvoice,
    customers,
    vendors,
    employees,
    totalPaidInvoices,
    totalPendingInvoices,
    fetchAllInvoicesApi,
    fetchReceivableInvoicesApi,
    fetchPayableInvoicesApi,
  } = useContext(DataContext);

  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL, Receivable, Payable
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load invoices from API
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        setApiError(null);
        console.log(`📥 Fetching ${typeFilter} invoices...`);

        let apiInvoices = [];

        if (typeFilter === "ALL") {
          apiInvoices = await fetchAllInvoicesApi();
        } else if (typeFilter === "Receivable") {
          apiInvoices = await fetchReceivableInvoicesApi();
        } else if (typeFilter === "Payable") {
          apiInvoices = await fetchPayableInvoicesApi();
        }

        if (apiInvoices && apiInvoices.length > 0) {
          console.log(`✅ Loaded ${apiInvoices.length} ${typeFilter} invoices`);
          console.table(apiInvoices.slice(0, 3)); // Log first 3
        } else {
          console.log(`⚠️ No ${typeFilter} invoices found`);
        }
      } catch (error) {
        console.error(`❌ Error loading ${typeFilter} invoices:`, error);
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [typeFilter]);

  return (
    <Box className="space-y-4">
      {/* Error Alert */}
      {apiError && (
        <Box
          sx={{ p: 2, bgcolor: "#ffebee", borderRadius: 1, color: "#c62828" }}
        >
          <Typography variant="body2">
            Error loading invoices: {apiError}
          </Typography>
        </Box>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Loading invoices...
          </Typography>
        </Box>
      )}

      {/* Type Filter Buttons */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {["ALL", "Receivable", "Payable"].map((type) => (
          <Button
            key={type}
            variant={typeFilter === type ? "contained" : "outlined"}
            onClick={() => setTypeFilter(type)}
            disabled={loading}
          >
            {type === "ALL" ? "All Invoices" : `${type}`}
          </Button>
        ))}
      </Box>

      {/* Rest of your component */}
      {/* ... existing code ... */}
    </Box>
  );
}
```

## Option 3: Full Integration with Sync

Sync API data with local state:

```javascript
import { useContext, useEffect, useState, useCallback } from "react";
import { DataContext } from "@/context/DataContext";

export default function InvoicesPage() {
  const {
    invoices,
    addInvoice,
    fetchAllInvoicesApi,
    fetchReceivableInvoicesApi,
    fetchPayableInvoicesApi,
  } = useContext(DataContext);

  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, synced, error
  const [syncError, setSyncError] = useState(null);

  // Sync invoices from API
  const syncInvoicesFromApi = useCallback(async () => {
    try {
      setSyncStatus("syncing");
      setSyncError(null);
      console.log("🔄 Syncing invoices from API...");

      const startTime = Date.now();
      const apiInvoices = await fetchAllInvoicesApi();
      const duration = Date.now() - startTime;

      if (apiInvoices && Array.isArray(apiInvoices) && apiInvoices.length > 0) {
        console.log(`✅ Synced ${apiInvoices.length} invoices (${duration}ms)`);

        // Update local state with API data
        apiInvoices.forEach((apiInv) => {
          // Check if invoice already exists
          const exists = invoices.some((inv) => inv.id === apiInv.id);
          if (!exists) {
            addInvoice(apiInv);
          }
        });

        setSyncStatus("synced");
      } else {
        console.warn("⚠️ No invoices received from API");
        setSyncStatus("synced");
      }
    } catch (error) {
      console.error("❌ Sync failed:", error);
      setSyncStatus("error");
      setSyncError(error.message);
    }
  }, [invoices, addInvoice, fetchAllInvoicesApi]);

  // Sync on mount
  useEffect(() => {
    syncInvoicesFromApi();
  }, []);

  // Sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        console.log("⏰ Auto-sync: Refreshing invoices...");
        syncInvoicesFromApi();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [syncInvoicesFromApi]);

  return (
    <Box className="space-y-4">
      {/* Sync Status Indicator */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Sync Status:
        </Typography>
        {syncStatus === "syncing" && (
          <>
            <CircularProgress size={20} />
            <Typography variant="body2">Syncing...</Typography>
          </>
        )}
        {syncStatus === "synced" && (
          <>
            <CheckCircle sx={{ color: "#4caf50" }} />
            <Typography variant="body2" sx={{ color: "#4caf50" }}>
              Synced
            </Typography>
          </>
        )}
        {syncStatus === "error" && (
          <>
            <ErrorIcon sx={{ color: "#f44336" }} />
            <Typography variant="body2" sx={{ color: "#f44336" }}>
              Sync Error: {syncError}
            </Typography>
          </>
        )}
      </Box>

      {/* Manual Sync Button */}
      <Button
        onClick={syncInvoicesFromApi}
        disabled={syncStatus === "syncing"}
        variant="outlined"
        size="small"
      >
        {syncStatus === "syncing" ? "Syncing..." : "Sync Now"}
      </Button>

      {/* Rest of your component */}
      {/* ... existing code ... */}
    </Box>
  );
}
```

## Testing the Integration

### In Browser Console

```javascript
// Test loading receivable invoices
const { DataContext } = await import("/src/context/DataContext");
const { fetchReceivableInvoicesApi } = useContext(DataContext);

console.log("Testing API functions...");

// Test 1: Receivable
console.log("1️⃣ Fetching Receivable Invoices:");
await fetchReceivableInvoicesApi();

// Test 2: Payable
console.log("2️⃣ Fetching Payable Invoices:");
await fetchPayableInvoicesApi();

// Test 3: All
console.log("3️⃣ Fetching All Invoices:");
await fetchAllInvoicesApi();

// Test 4: Single
console.log("4️⃣ Fetching Single Invoice:");
await fetchInvoiceByIdApi("R-56521");
```

### Expected Console Output

```
📥 Fetching Receivable Invoices...
✅ Receivable Invoices Fetched (245ms): [
  { invoice_no: "R-56521", type: "Receivable", amount: 110 },
  { invoice_no: "R-56522", type: "Receivable", amount: 250 }
]

📥 Fetching Payable Invoices...
✅ Payable Invoices Fetched (187ms): [
  { invoice_no: "P-38664", type: "Payable", amount: 1200 }
]

📥 Fetching All Invoices (Receivable + Payable)...
✅ All Invoices Fetched (342ms): [
  { invoice_no: "R-56521", type: "Receivable", amount: 110 },
  { invoice_no: "P-38664", type: "Payable", amount: 1200 }
]

📥 Fetching Invoice by ID: R-56521
✅ Invoice Fetched (156ms): { invoice_no: "R-56521", type: "Receivable", amount: 110 }
```

## Performance Monitoring

Add this code to track API performance:

```javascript
// Create an object to track API performance
const apiPerformance = {
  receivable: { calls: 0, totalTime: 0, avgTime: 0 },
  payable: { calls: 0, totalTime: 0, avgTime: 0 },
  all: { calls: 0, totalTime: 0, avgTime: 0 },
  single: { calls: 0, totalTime: 0, avgTime: 0 },
};

// Add timing to each API call
console.log("📊 API Performance Metrics:");
Object.entries(apiPerformance).forEach(([key, stats]) => {
  console.log(`${key}: ${stats.calls} calls, avg ${stats.avgTime}ms`);
});
```

## Handling Different Response Formats

The APIs are designed to handle different response formats from backend:

```javascript
// These all return the same data:

// Format 1: { data: [...] }
const invoices1 = await fetchReceivableInvoicesApi();

// Format 2: { invoices: [...] }
const invoices2 = await fetchReceivableInvoicesApi();

// Format 3: Direct array [...]
const invoices3 = await fetchReceivableInvoicesApi();

// All return the same: Array<Invoice>
```

## Error Recovery Strategies

```javascript
// Strategy 1: Fallback to cached invoices
const [cachedInvoices, setCachedInvoices] = useState([]);

const loadWithFallback = async () => {
  const fresh = await fetchAllInvoicesApi();
  if (fresh && fresh.length > 0) {
    setCachedInvoices(fresh);
    return fresh;
  } else {
    console.warn("Using cached invoices");
    return cachedInvoices;
  }
};

// Strategy 2: Retry with exponential backoff
const retryFetch = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delayMs = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      console.log(`⏳ Retrying in ${delayMs}ms... (attempt ${i + 1})`);

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

// Usage
const invoices = await retryFetch(() => fetchAllInvoicesApi());
```

## Data Mapping for Different Backends

If your backend returns different field names, map the data:

```javascript
const mapInvoiceFromBackend = (backendInvoice) => {
  return {
    id: backendInvoice.id || backendInvoice.invoice_id,
    invoiceNo: backendInvoice.invoice_no || backendInvoice.number,
    type: backendInvoice.type || backendInvoice.invoice_type,
    amount: parseFloat(backendInvoice.amount || 0),
    status: backendInvoice.status || "Pending",
    date: backendInvoice.date || backendInvoice.created_at,
    // ... other fields
  };
};

// Use when loading
const raw = await fetchReceivableInvoicesApi();
const mapped = raw.map(mapInvoiceFromBackend);
```

---

## Summary

The new API functions make it easy to:

1. ✅ Load receivable invoices
2. ✅ Load payable invoices
3. ✅ Load all invoices at once
4. ✅ Get individual invoice details
5. ✅ Handle errors gracefully
6. ✅ Monitor performance

Choose the integration option that best fits your needs and implement it in InvoicesPage!
