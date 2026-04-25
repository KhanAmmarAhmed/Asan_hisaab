# CORS Error Fix Guide

## Problem

You're seeing CORS errors when making API requests from `http://localhost:5173` to `https://fisdemoprojects.com/assanhisaab/`:

```
Access to XMLHttpRequest at 'https://fisdemoprojects.com/assanhisaab/projects_api.php'
from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight
request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

## Root Cause

The backend server is not configured to accept requests from your frontend origin (`http://localhost:5173`). The backend needs to respond with appropriate CORS headers.

---

## Solution 1: Backend Configuration (Recommended)

Add CORS headers to your PHP backend files. Add this at the **very start** of each API file (before any output):

### For PHP Endpoints (projects_api.php, invoice_api.php, etc.)

```php
<?php
// Enable CORS - Add this at the very start of the file
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ... rest of your code ...
?>
```

### For Production

Replace `http://localhost:5173` with your production domain:

```php
header("Access-Control-Allow-Origin: https://yourdomain.com");
```

### Allow Multiple Origins

If you need multiple origins during development:

```php
<?php
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://yourdomain.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

---

## Solution 2: Development Proxy (Temporary Workaround)

If you don't have access to modify the backend, you can use a proxy during development.

### Option A: Vite Proxy Configuration

Update `vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      "/api": {
        target: "https://fisdemoprojects.com/assanhisaab",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
```

Then update your API client to use the proxy:

```javascript
// In apiClient.js
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5173/api" // Use proxy in development
    : "https://fisdemoprojects.com/assanhisaab"; // Use real URL in production
```

Usage:

```javascript
// Instead of: /projects_api.php
// Use: /projects_api.php (will be proxied automatically in dev)
```

### Option B: CORS Browser Extensions (Not Recommended for Production)

For local testing only, you can use browser extensions like:

- `Allow CORS: Access-Control-Allow-Origin` (Chrome/Edge)
- But **never rely on this for production!**

---

## Solution 3: Update apiClient.js for Better Error Handling

Add proxy URL configuration:

```javascript
// At the top of apiClient.js
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? process.env.VITE_API_URL || "http://localhost:5173/api"
    : "https://fisdemoprojects.com/assanhisaab";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // ... rest of config
});
```

Create a `.env.development` file:

```
VITE_API_URL=http://localhost:5173/api
```

---

## Testing the Fix

### Test 1: Check Response Headers (Browser DevTools)

1. Open **Developer Tools** → **Network** tab
2. Make an API request
3. Click on the request in the Network tab
4. Look for response headers like:
   ```
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
   ```

### Test 2: Console Test

When CORS is fixed, you should see successful logs like:

```javascript
// Success logs without CORS errors
📥 Fetching Projects...
✅ Projects Fetched (245ms): {data: Array(5)}

📥 Fetching Invoices...
✅ Invoices Fetched (189ms): {invoices: Array(12)}
```

---

## Files That Need CORS Headers

Based on your API usage, add CORS headers to:

- ✅ `/projects_api.php`
- ✅ `/invoice_api.php`
- ✅ `/customer_api.php`
- ✅ `/employee_api.php`
- ✅ `/vendor_api.php`
- ✅ `/transaction_api.php`
- ✅ `/save_order.php`
- ✅ `/create_order.php`
- ✅ `/get_invoice.php`

---

## Quick Checklist

- [ ] Backend server has CORS headers configured
- [ ] `Access-Control-Allow-Origin` includes your frontend URL
- [ ] Headers are added before any output in PHP files
- [ ] OPTIONS preflight requests are handled
- [ ] Tested in browser DevTools Network tab
- [ ] No more CORS errors in browser console

---

## Support Links

- [MDN: CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS](https://owasp.org/www-community/attacks/CORS)
- [Vite: Server Options](https://vitejs.dev/config/server-options.html#server-proxy)
- [Axios: Request Config](https://axios-http.com/docs/req_config)
