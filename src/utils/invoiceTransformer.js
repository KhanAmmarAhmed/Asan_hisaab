/**
 * Invoice Transformer Utility
 * Converts nested API response structure to flat format for UI display
 */

/**
 * Transform API invoice response to display format
 * Handles both simple and complex nested structures
 * @param {Object} apiInvoice - Invoice data from API
 * @returns {Object} Transformed invoice object for UI display
 */
export const transformInvoiceFromAPI = (apiInvoice) => {
  if (!apiInvoice) return null;

  // If it's already a flat structure, return as-is
  if (!apiInvoice.order && !apiInvoice.order_items && !apiInvoice.Payable_details && !apiInvoice.Receivable_details) {
    return apiInvoice;
  }

  // Extract order data (main invoice info)
  const orderData = apiInvoice.order || {};
  const orderItems = apiInvoice.order_items || {};
  const payableDetails = apiInvoice.Payable_details || {};
  const receivableDetails = apiInvoice.Receivable_details || {};

  // Get the first order item to extract invoice-level totals
  const firstOrderItem = Object.values(orderItems)?.[0] || {};

  // Extract line items from details
  const items = transformDetailsToItems(payableDetails || receivableDetails);

  // Determine invoice type
  const invoiceType = orderData.type || "Payable";
  const isTaxable = String(firstOrderItem.taxable || "no").toLowerCase() === "yes" ? "Yes" : "No";

  // Build transformed invoice object
  const transformedInvoice = {
    // Core fields
    voucher: orderData.invoice || "",
    invoiceNo: orderData.invoice || "",
    type: invoiceType,
    entity: orderData.entity_name || "",
    
    // Financial fields - use order_items totals as primary source
    amount: Number(firstOrderItem.amount) || Number(orderData.total) || 0,
    discount: Number(firstOrderItem.discount) || 0,
    subTotal: Number(firstOrderItem.sub_total) || 0,
    taxAble: isTaxable,
    grandTotal: Number(firstOrderItem.grand_total) || Number(orderData.total) || 0,
    
    // Metadata
    date: orderData.created_at || firstOrderItem.created_at || new Date().toISOString().split("T")[0],
    reference: orderData.invoice || "",
    status: "Pending",
    madeBy: "System",
    
    // Items/Details array - extracted from Payable_details/Receivable_details
    items: items,
    
    // Raw data for reference (if needed for debugging)
    orderData: orderData,
    orderItems: orderItems,
    detailsData: payableDetails || receivableDetails,
  };

  return transformedInvoice;
};

/**
 * Transform details object to items array
 * Converts Payable_details/Receivable_details to items array format
 * @param {Object} detailsObj - Details object from API (keyed by numeric IDs)
 * @returns {Array} Array of transformed items
 */
export const transformDetailsToItems = (detailsObj) => {
  if (!detailsObj || typeof detailsObj !== "object") {
    return [];
  }

  return Object.values(detailsObj).map((detail) => ({
    id: detail.id || detail.item_id || Date.now(),
    itemName: detail.item_name || "",
    quantity: Number(detail.qty) || 0,
    price: Number(detail.price) || 0,
    total: Number(detail.total) || 0,
    // Include additional fields for reference
    createdAt: detail.created_at || "",
  }));
};

/**
 * Transform flat invoice to API request format (reverse operation)
 * @param {Object} invoice - UI invoice object
 * @returns {Object} API-formatted invoice
 */
export const transformInvoiceToAPI = (invoice) => {
  if (!invoice) return null;

  return {
    invoice_no: invoice.voucher || invoice.invoiceNo || "",
    type: invoice.type || "Payable",
    entity_name: invoice.entity || "",
    amount: invoice.amount || 0,
    discount: invoice.discount || 0,
    sub_total: invoice.subTotal || 0,
    taxable: invoice.taxAble === "Yes" ? "yes" : "no",
    grand_total: invoice.grandTotal || 0,
    items: invoice.items || [],
  };
};

/**
 * Batch transform multiple invoices from API response
 * @param {Array} apiInvoices - Array of invoice objects from API
 * @returns {Array} Array of transformed invoices
 */
export const transformInvoicesFromAPI = (apiInvoices) => {
  if (!Array.isArray(apiInvoices)) {
    return [];
  }

  return apiInvoices.map((invoice) => transformInvoiceFromAPI(invoice)).filter(Boolean);
};
