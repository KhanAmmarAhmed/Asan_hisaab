// import React, { createContext, useState, useEffect, useMemo } from "react";
// import { fetchCustomersApi } from "../services/customerApi";

// export const DataContext = createContext();

// const generateId = () =>
//   `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// const ensureId = (record) => ({
//   ...record,
//   id: record.id || generateId(),
// });

// const ensureIdsInArray = (records) => records.map(ensureId);

// // Helper to parse amount strings like "Rs. 40,000" or numbers into a numeric value
// export const parseAmount = (val) => {
//   if (typeof val === "number") return val;
//   if (!val) return 0;
//   const cleaned = String(val).replace(/[^0-9.]/g, "");
//   return parseFloat(cleaned) || 0;
// };

// export const DataProvider = ({ children }) => {
//   // --- Initialize state from localStorage or default ---
//   const [customers, setCustomers] = useState([]);

//   const [vendors, setVendors] = useState(() => {
//     const saved = localStorage.getItem("vendors");
//     return saved
//       ? ensureIdsInArray(JSON.parse(saved))
//       : ensureIdsInArray([
//           {
//             venderName: "Muhammad Usman",
//             phone: "03048973476",
//             email: "usman123@gmail.com",
//             address: "Rawalpindi",
//             date: "2024-01-10",
//           },
//           {
//             venderName: "Ehtesham Ali",
//             phone: "03157629450",
//             email: "ehteshamali@gmail.com",
//             address: "Mianwali",
//             date: "2024-01-15",
//           },
//         ]);
//   });

//   const [projects, setProjects] = useState(() => {
//     const saved = localStorage.getItem("projects");
//     return saved
//       ? ensureIdsInArray(JSON.parse(saved))
//       : ensureIdsInArray([
//           { name: "Friends It Solutions", type: "FIS - IT Company" },
//           { name: "BSB", type: "FIS - IT Company" },
//           { name: "Business Solutions", type: "FIS - IT Company" },
//         ]);
//   });

//   const [employees, setEmployees] = useState(() => {
//     const saved = localStorage.getItem("employees");
//     return saved
//       ? ensureIdsInArray(JSON.parse(saved))
//       : ensureIdsInArray([
//           {
//             employeeName: "Muhammad Usman",
//             phone: "03048973476",
//             email: "usman123@gmail.com",
//             address: "Rawalpindi",
//             date: "2024-01-10",
//           },
//           {
//             employeeName: "Ehtesham Ali",
//             phone: "03157629450",
//             email: "ehteshamali@gmail.com",
//             address: "Mianwali",
//             date: "2024-01-15",
//           },
//         ]);
//   });

//   const [invoices, setInvoices] = useState(() => {
//     const saved = localStorage.getItem("invoices");
//     return saved ? ensureIdsInArray(JSON.parse(saved)) : [];
//   });

//   const [income, setIncome] = useState(() => {
//     const saved = localStorage.getItem("income");
//     return saved ? ensureIdsInArray(JSON.parse(saved)) : [];
//   });

//   const [expenses, setExpenses] = useState(() => {
//     const saved = localStorage.getItem("expenses");
//     return saved ? ensureIdsInArray(JSON.parse(saved)) : [];
//   });

//   // --- Persistence Hooks ---
//   useEffect(() => {
//     // localStorage.setItem("customers", JSON.stringify(customers));
//     localStorage.setItem("vendors", JSON.stringify(vendors));
//     localStorage.setItem("projects", JSON.stringify(projects));
//     localStorage.setItem("employees", JSON.stringify(employees));
//     localStorage.setItem("invoices", JSON.stringify(invoices));
//     localStorage.setItem("income", JSON.stringify(income));
//     localStorage.setItem("expenses", JSON.stringify(expenses));
//   }, [vendors, projects, employees, invoices, income, expenses]);

//   // --- Customers: API-backed (no localStorage) ---
//   useEffect(() => {
//     let isMounted = true;

//     const mapCustomer = (c) => ({
//       id: c?.id ?? c?.customer_id ?? c?.customerId ?? undefined,
//       customerName: c?.customerName ?? c?.name ?? "",
//       phone: c?.phone ?? c?.number ?? "",
//       email: c?.email ?? "",
//       address: c?.address ?? "",
//       date: c?.date ?? c?.created_at ?? c?.createdAt ?? "",
//     });

//     (async () => {
//       try {
//         const result = await fetchCustomersApi();
//         const list = Array.isArray(result)
//           ? result
//           : Array.isArray(result?.customers)
//             ? result.customers
//             : Array.isArray(result?.data)
//               ? result.data
//               : [];

//         if (!isMounted) return;
//         setCustomers(ensureIdsInArray(list.map(mapCustomer)));
//       } catch (err) {
//         // Keep UI functional even if backend doesn't support listing yet.
//         console.warn("Failed to fetch customers:", err);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // --- Helper Actions ---
//   const addCustomer = (customer) =>
//     setCustomers((prev) => [ensureId(customer), ...prev]);
//   const addVendor = (vendor) =>
//     setVendors((prev) => [ensureId(vendor), ...prev]);
//   const addProject = (project) =>
//     setProjects((prev) => [...prev, ensureId(project)]);
//   const updateProject = (index, updatedProject) => {
//     setProjects((prev) =>
//       prev.map((p, i) => (i === index ? updatedProject : p)),
//     );
//   };
//   const addEmployee = (employee) =>
//     setEmployees((prev) => [ensureId(employee), ...prev]);
//   const addInvoice = (invoice) =>
//     setInvoices((prev) => [ensureId(invoice), ...prev]);
//   const updateInvoice = (index, updated) =>
//     setInvoices((prev) => prev.map((inv, i) => (i === index ? updated : inv)));
//   const addIncome = (entry) => setIncome((prev) => [ensureId(entry), ...prev]);
//   const updateIncome = (id, updated) =>
//     setIncome((prev) => prev.map((inc, i) => (inc.id === id ? updated : inc)));
//   const addExpense = (entry) =>
//     setExpenses((prev) => [ensureId(entry), ...prev]);
//   const updateExpense = (id, updated) =>
//     setExpenses((prev) =>
//       prev.map((exp, i) => (exp.id === id ? updated : exp)),
//     );

//   // --- Computed Financial Summaries ---
//   const totalIncome = useMemo(
//     () =>
//       income.reduce((sum, item) => {
//         return sum + parseAmount(item.amount);
//       }, 0),
//     [income],
//   );

//   const totalExpenses = useMemo(
//     () =>
//       expenses.reduce((sum, item) => {
//         return sum + parseAmount(item.amount);
//       }, 0),
//     [expenses],
//   );

//   const grossProfit = useMemo(
//     () => totalIncome - totalExpenses,
//     [totalIncome, totalExpenses],
//   );

//   // Total receivable: "Paid" invoices (Sales type)
//   const totalReceivable = useMemo(
//     () =>
//       invoices
//         .filter(
//           (inv) =>
//             inv.entityType === "Customer" ||
//             inv.type?.toLowerCase().includes("sales"),
//         )
//         .reduce((sum, inv) => {
//           return sum + parseAmount(inv.amount);
//         }, 0),
//     [invoices],
//   );

//   // Total payables: invoices owed to suppliers/vendors
//   const totalPayables = useMemo(
//     () =>
//       invoices
//         .filter(
//           (inv) =>
//             inv.entityType === "Supplier" ||
//             inv.type?.toLowerCase().includes("purchase"),
//         )
//         .reduce((sum, inv) => {
//           return sum + parseAmount(inv.amount);
//         }, 0),
//     [invoices],
//   );

//   const totalPaidInvoices = useMemo(
//     () =>
//       invoices
//         .filter((inv) => inv.status === "Paid")
//         .reduce((sum, i) => {
//           return sum + parseAmount(i.amount);
//         }, 0),
//     [invoices],
//   );

//   const totalPendingInvoices = useMemo(
//     () =>
//       invoices
//         .filter((inv) => inv.status === "Pending")
//         .reduce((sum, i) => {
//           return sum + parseAmount(i.amount);
//         }, 0),
//     [invoices],
//   );

//   // Monthly chart data derived from real income + expense entries
//   const monthlyChartData = useMemo(() => {
//     const MONTHS = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     const incomeMap = {};
//     const expenseMap = {};

//     income.forEach((item) => {
//       const date = new Date(item.date || item.createdAt);
//       if (!isNaN(date)) {
//         const key = `${date.getFullYear()}-${date.getMonth()}`;
//         incomeMap[key] = (incomeMap[key] || 0) + parseAmount(item.amount);
//       }
//     });

//     expenses.forEach((item) => {
//       const date = new Date(item.date || item.createdAt);
//       if (!isNaN(date)) {
//         const key = `${date.getFullYear()}-${date.getMonth()}`;
//         expenseMap[key] = (expenseMap[key] || 0) + parseAmount(item.amount);
//       }
//     });

//     // Show last 12 months
//     const result = [];
//     const now = new Date();
//     for (let i = 11; i >= 0; i--) {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const key = `${d.getFullYear()}-${d.getMonth()}`;
//       result.push({
//         month: MONTHS[d.getMonth()],
//         income: Math.round(incomeMap[key] || 0),
//         expense: Math.round(expenseMap[key] || 0),
//       });
//     }
//     return result;
//   }, [income, expenses]);

//   // --- NEW: Weekly chart data ---
//   const weeklyChartData = useMemo(() => {
//     // Helper: get the Sunday of the week for a given date
//     const getWeekStart = (date) => {
//       const d = new Date(date);
//       const day = d.getDay(); // 0 = Sunday
//       d.setDate(d.getDate() - day);
//       return d;
//     };

//     const incomeMap = {};
//     const expenseMap = {};

//     // Aggregate income by week start (Sunday)
//     income.forEach((item) => {
//       const date = new Date(item.date || item.createdAt);
//       if (!isNaN(date)) {
//         const weekStart = getWeekStart(date);
//         const key = weekStart.toISOString().split("T")[0]; // YYYY-MM-DD
//         incomeMap[key] = (incomeMap[key] || 0) + parseAmount(item.amount);
//       }
//     });

//     // Aggregate expenses by week start
//     expenses.forEach((item) => {
//       const date = new Date(item.date || item.createdAt);
//       if (!isNaN(date)) {
//         const weekStart = getWeekStart(date);
//         const key = weekStart.toISOString().split("T")[0];
//         expenseMap[key] = (expenseMap[key] || 0) + parseAmount(item.amount);
//       }
//     });

//     // Build the last 12 weeks (enough for a 7‑week view)
//     const result = [];
//     const now = new Date();
//     for (let i = 11; i >= 0; i--) {
//       const d = new Date(now);
//       d.setDate(now.getDate() - i * 7); // go back i weeks
//       const weekStart = getWeekStart(d);
//       const key = weekStart.toISOString().split("T")[0];

//       // Format label as "MMM D" (e.g., "Feb 10")
//       const month = weekStart.toLocaleString("default", { month: "short" });
//       const day = weekStart.getDate();
//       const label = `${month} ${day}`;

//       result.push({
//         weekLabel: label,
//         income: Math.round(incomeMap[key] || 0),
//         expense: Math.round(expenseMap[key] || 0),
//       });
//     }
//     return result;
//   }, [income, expenses]);

//   // Recent transactions: merge income and expenses, sorted by date, latest 10
//   const recentTransactions = useMemo(() => {
//     const incomeEntries = income.map((i) => ({
//       ...i,
//       category: "Income",
//       color: "green",
//     }));
//     const expenseEntries = expenses.map((e) => ({
//       ...e,
//       category: "Expense",
//       color: "red",
//     }));
//     return [...incomeEntries, ...expenseEntries]
//       .sort(
//         (a, b) =>
//           new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
//       )
//       .slice(0, 10);
//   }, [income, expenses]);

//   // Expense breakdowns by time period helper
//   const getExpenseSummary = useMemo(() => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     const getTotal = (items) =>
//       items.reduce((s, i) => {
//         return s + parseAmount(i.amount);
//       }, 0);

//     const filterItemsByRange = (items, from, to) =>
//       items.filter((i) => {
//         const d = new Date(i.date || i.createdAt);
//         return !isNaN(d) && d >= from && d <= to;
//       });

//     const isSameDay = (d1, d2) =>
//       d1.getFullYear() === d2.getFullYear() &&
//       d1.getMonth() === d2.getMonth() &&
//       d1.getDate() === d2.getDate();

//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     const yesterdayExpenses = expenses.filter((i) => {
//       const d = new Date(i.date || i.createdAt);
//       return !isNaN(d) && isSameDay(d, yesterday);
//     });

//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());
//     const thisWeekExpenses = filterItemsByRange(expenses, startOfWeek, now);

//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const thisMonthExpenses = filterItemsByRange(expenses, startOfMonth, now);

//     const startOfYear = new Date(today.getFullYear(), 0, 1);
//     const thisYearExpenses = filterItemsByRange(expenses, startOfYear, now);

//     const fmt = (n) => `Rs. ${n.toLocaleString()}`;

//     return [
//       {
//         period: "Yesterday",
//         current: fmt(getTotal(yesterdayExpenses)),
//       },
//       {
//         period: "This Week",
//         current: fmt(getTotal(thisWeekExpenses)),
//       },
//       {
//         period: "This Month",
//         current: fmt(getTotal(thisMonthExpenses)),
//       },
//       {
//         period: "This Year",
//         current: fmt(getTotal(thisYearExpenses)),
//       },
//     ];
//   }, [expenses]);

//   return (
//     <DataContext.Provider
//       value={{
//         // Entities
//         customers,
//         addCustomer,
//         vendors,
//         addVendor,
//         projects,
//         addProject,
//         updateProject,
//         employees,
//         addEmployee,
//         invoices,
//         addInvoice,
//         updateInvoice,
//         income,
//         addIncome,
//         updateIncome,
//         expenses,
//         addExpense,
//         updateExpense,
//         // Computed financials
//         totalIncome,
//         totalExpenses,
//         grossProfit,
//         totalReceivable,
//         totalPayables,
//         totalPaidInvoices,
//         totalPendingInvoices,
//         monthlyChartData,
//         weeklyChartData,
//         recentTransactions,
//         getExpenseSummary,
//       }}
//     >
//       {children}
//     </DataContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect, useMemo } from "react";
import { fetchCustomersApi } from "../services/customerApi";
import { fetchEmployeesApi } from "../services/employeeApi";
import { fetchVendorsApi } from "../services/vendorApi";
import { 
  fetchProjectsApi, 
  addProjectApi, 
  updateProjectApi 
} from "../services/projectApi";
import { 
  fetchInvoicesApi, 
  addInvoiceApi, 
  updateInvoiceApi 
} from "../services/invoiceApi";
import { 
  fetchTransactionsApi,
  addIncomeTransactionApi,
  addExpenseTransactionApi 
} from "../services/transactionApi";

export const DataContext = createContext();

export const parseAmount = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value) ? null : value;
  const raw = String(value).trim();
  if (!raw) return null;
  const normalized = raw.includes(" ") && !raw.includes("T")
    ? raw.replace(" ", "T")
    : raw;
  const parsed = new Date(normalized);
  return isNaN(parsed) ? null : parsed;
};

const toIsoDate = (value) => {
  const date = toDate(value);
  return date ? date.toISOString().split("T")[0] : "";
};

const resolveTransactionDate = (item) =>
  toIsoDate(
    item?.date ??
      item?.transaction_date ??
      item?.transactionDate ??
      item?.created_at ??
      item?.createdAt,
  );

const resolveTransactionAmount = (item) =>
  parseAmount(
    item?.amount ??
      item?.total ??
      item?.total_amount ??
      item?.totalAmount ??
      item?.value,
  );

const resolveTransactionEntityName = (item) =>
  item?.entityName ??
  item?.entity_name ??
  item?.customer_name ??
  item?.vendor_name ??
  item?.employee_name ??
  item?.customerName ??
  item?.vendorName ??
  item?.employeeName ??
  item?.entity ??
  "";

const normalizeTransaction = (item, fallbackEntityType) => {
  const normalizedDate = resolveTransactionDate(item);
  return {
    ...item,
    id:
      item?.id ??
      item?.transaction_id ??
      item?.transactionId ??
      item?.transactionID ??
      undefined,
    voucher:
      item?.voucher ??
      item?.voucher_no ??
      item?.voucherNo ??
      item?.voucherNumber ??
      item?.voucher_num,
    entityName: resolveTransactionEntityName(item),
    accountHead: item?.account_head ?? item?.accountHead ?? item?.head ?? "",
    paymentMethod:
      item?.payment_method ?? item?.paymentMethod ?? item?.method ?? "",
    status: item?.status ?? "Invoiced",
    amount: resolveTransactionAmount(item),
    date: normalizedDate,
    createdAt:
      item?.createdAt ??
      item?.created_at ??
      normalizedDate ??
      item?.date ??
      "",
    entityType: item?.entity ?? item?.entityType ?? fallbackEntityType,
  };
};

const normalizeTransactions = (items, fallbackEntityType) =>
  (Array.isArray(items) ? items : []).map((item) =>
    normalizeTransaction(item, fallbackEntityType),
  );

const getTransactionDateObject = (item) =>
  toDate(
    item?.date ??
      item?.transaction_date ??
      item?.transactionDate ??
      item?.created_at ??
      item?.createdAt,
  );

// Default data for each entity
const DEFAULT_PROJECTS = [
  { name: "Friends It Solutions", type: "FIS - IT Company" },
  { name: "BSB", type: "FIS - IT Company" },
  { name: "Business Solutions", type: "FIS - IT Company" },
];

export const DataProvider = ({ children }) => {
  // Customers are now API‑backed – start with empty array
  const [customers, setCustomers] = useState([]);

  // Vendors are API-backed
  const [vendors, setVendors] = useState([]);

  // Projects are API-backed
  const [projects, setProjects] = useState([]);

  // Employees are API-backed 
  const [employees, setEmployees] = useState([]);

  // Invoices are API-backed
  const [invoices, setInvoices] = useState([]);

  // Income is API-backed
  const [income, setIncome] = useState([]);

  // Expenses are API-backed
  const [expenses, setExpenses] = useState([]);

  // Fetch customers from API on mount
  useEffect(() => {
    let isMounted = true;

    const mapCustomer = (c) => ({
      id: c?.id ?? c?.customer_id ?? c?.customerId ?? undefined,
      customerName: c?.name ?? c?.customerName ?? "", // API uses "name"
      phone: c?.number ?? c?.phone ?? "", // API uses "number"
      email: c?.email ?? "",
      address: c?.Address ?? c?.address ?? "", // API uses "Address" (capital A)
      date: String(c?.created_at ?? c?.date ?? c?.createdAt ?? "").split(
        " ",
      )[0], // API uses "created_at"
    });

    (async () => {
      try {
        const list = await fetchCustomersApi();

        if (!isMounted) return;
        setCustomers(Array.isArray(list) ? list.map(mapCustomer) : []);
      } catch (err) {
        console.warn("Failed to fetch customers:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch employees from API on mount
  useEffect(() => {
    let isMounted = true;

    const mapEmployee = (e) => ({
      id: e?.id ?? e?.employee_id ?? e?.employeeId ?? undefined,
      employeeName: e?.name ?? e?.employeeName ?? "",
      phone: e?.number ?? e?.phone ?? "",
      email: e?.email ?? "",
      address: e?.address ?? e?.Address ?? "",
      department: e?.department ?? "",
      designation: e?.designation ?? "",
      date: String(e?.created_at ?? e?.date ?? e?.createdAt ?? "").split(
        " ",
      )[0],
    });

    (async () => {
      try {
        const list = await fetchEmployeesApi();
        if (!isMounted) return;
        setEmployees(Array.isArray(list) ? list.map(mapEmployee) : []);
      } catch (err) {
        console.warn("Failed to fetch employees:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch vendors from API on mount
  useEffect(() => {
    let isMounted = true;

    const mapVendor = (v) => ({
      id: v?.id ?? v?.vendor_id ?? v?.vender_id ?? v?.vendorId ?? undefined,
      venderName: v?.name ?? v?.venderName ?? v?.vendorName ?? "",
      phone: v?.number ?? v?.phone ?? "",
      email: v?.email ?? "",
      address: v?.address ?? v?.Address ?? "",
      date: String(v?.created_at ?? v?.date ?? v?.createdAt ?? "").split(
        " ",
      )[0],
    });

    (async () => {
      try {
        const list = await fetchVendorsApi();
        if (!isMounted) return;
        setVendors(Array.isArray(list) ? list.map(mapVendor) : []);
      } catch (err) {
        console.warn("Failed to fetch vendors:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch projects from API on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await fetchProjectsApi();
        if (!isMounted) return;
        setProjects(Array.isArray(list) && list.length > 0 ? list : DEFAULT_PROJECTS);
      } catch (err) {
        console.warn("Failed to fetch projects:", err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Fetch invoices from API on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await fetchInvoicesApi();
        if (!isMounted) return;
        setInvoices(Array.isArray(list) ? list : []);
      } catch (err) {
        console.warn("Failed to fetch invoices:", err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Fetch income transactions from API on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await fetchTransactionsApi("income");
        if (!isMounted) return;
        setIncome(normalizeTransactions(list, "customer"));
      } catch (err) {
        console.warn("Failed to fetch income:", err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Fetch expense transactions from API on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await fetchTransactionsApi("expense");
        if (!isMounted) return;
        setExpenses(normalizeTransactions(list, "vendor"));
      } catch (err) {
        console.warn("Failed to fetch expenses:", err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // --- Helper Actions ---
  const addCustomer = (customer) => setCustomers((prev) => [customer, ...prev]);

  const addVendor = (vendor) => setVendors((prev) => [vendor, ...prev]);

  const addProject = async (project) => {
    try {
      const savedProject = await addProjectApi(project);
      setProjects((prev) => [...prev, savedProject]);
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  };

  const updateProject = async (index, updatedProject) => {
    try {
      const pid = projects[index]?.id;
      if (!pid) return;
      const savedProject = await updateProjectApi({ ...updatedProject, id: pid });
      setProjects((prev) => prev.map((p, i) => (i === index ? savedProject : p)));
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  const addEmployee = (employee) => setEmployees((prev) => [employee, ...prev]);

  const addInvoice = async (invoice) => {
    try {
      const savedInvoice = await addInvoiceApi(invoice);
      setInvoices((prev) => [savedInvoice, ...prev]);
    } catch (err) {
      console.error("Failed to add invoice:", err);
    }
  };

  const updateInvoice = async (index, updated) => {
    try {
      const iid = invoices[index]?.id;
      if (!iid) return;
      const savedInvoice = await updateInvoiceApi({ ...updated, id: iid });
      setInvoices((prev) => prev.map((inv, i) => (i === index ? savedInvoice : inv)));
    } catch (err) {
      console.error("Failed to update invoice:", err);
    }
  };

  const addIncome = async (entry) => {
    try {
      const savedEntry = await addIncomeTransactionApi(entry);
      setIncome((prev) => [
        normalizeTransaction(savedEntry, "customer"),
        ...prev,
      ]);
    } catch (err) {
       console.error("Failed to add income:", err);
    }
  };

  const updateIncome = (id, updated) =>
    setIncome((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? normalizeTransaction({ ...inc, ...updated }, inc.entityType)
          : inc,
      ),
    );

  const addExpense = async (entry) => {
    try {
      const savedEntry = await addExpenseTransactionApi(entry);
      setExpenses((prev) => [
        normalizeTransaction(savedEntry, "vendor"),
        ...prev,
      ]);
    } catch (err) {
       console.error("Failed to add expense:", err);
    }
  };

  const updateExpense = (id, updated) =>
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id
          ? normalizeTransaction({ ...exp, ...updated }, exp.entityType)
          : exp,
      ),
    );

  // ... (rest of your computed values remain unchanged) ...

  // --- Computed Financial Summaries ---
  const totalIncome = useMemo(
    () => income.reduce((sum, item) => sum + parseAmount(item.amount), 0),
    [income],
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + parseAmount(item.amount), 0),
    [expenses],
  );

  const grossProfit = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses],
  );

  const totalReceivable = useMemo(
    () =>
      invoices
        .filter(
          (inv) =>
            inv.entityType === "Customer" ||
            inv.type?.toLowerCase().includes("sales"),
        )
        .reduce((sum, inv) => sum + parseAmount(inv.amount), 0),
    [invoices],
  );

  const totalPayables = useMemo(
    () =>
      invoices
        .filter(
          (inv) =>
            inv.entityType === "Supplier" ||
            inv.type?.toLowerCase().includes("purchase"),
        )
        .reduce((sum, inv) => sum + parseAmount(inv.amount), 0),
    [invoices],
  );

  const totalPaidInvoices = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "Paid")
        .reduce((sum, i) => sum + parseAmount(i.amount), 0),
    [invoices],
  );

  const totalPendingInvoices = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "Pending")
        .reduce((sum, i) => sum + parseAmount(i.amount), 0),
    [invoices],
  );

  const monthlyChartData = useMemo(() => {
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const incomeMap = {};
    const expenseMap = {};

    income.forEach((item) => {
      const date = getTransactionDateObject(item);
      if (date) {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        incomeMap[key] = (incomeMap[key] || 0) + parseAmount(item.amount);
      }
    });

    expenses.forEach((item) => {
      const date = getTransactionDateObject(item);
      if (date) {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        expenseMap[key] = (expenseMap[key] || 0) + parseAmount(item.amount);
      }
    });

    const result = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      result.push({
        month: MONTHS[d.getMonth()],
        income: Math.round(incomeMap[key] || 0),
        expense: Math.round(expenseMap[key] || 0),
      });
    }
    return result;
  }, [income, expenses]);

  const weeklyChartData = useMemo(() => {
    const getWeekStart = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      return d;
    };

    const incomeMap = {};
    const expenseMap = {};

    income.forEach((item) => {
      const date = getTransactionDateObject(item);
      if (date) {
        const weekStart = getWeekStart(date);
        const key = weekStart.toISOString().split("T")[0];
        incomeMap[key] = (incomeMap[key] || 0) + parseAmount(item.amount);
      }
    });

    expenses.forEach((item) => {
      const date = getTransactionDateObject(item);
      if (date) {
        const weekStart = getWeekStart(date);
        const key = weekStart.toISOString().split("T")[0];
        expenseMap[key] = (expenseMap[key] || 0) + parseAmount(item.amount);
      }
    });

    const result = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);
      const weekStart = getWeekStart(d);
      const key = weekStart.toISOString().split("T")[0];
      const month = weekStart.toLocaleString("default", { month: "short" });
      const day = weekStart.getDate();
      const label = `${month} ${day}`;
      result.push({
        weekLabel: label,
        income: Math.round(incomeMap[key] || 0),
        expense: Math.round(expenseMap[key] || 0),
      });
    }
    return result;
  }, [income, expenses]);

  const recentTransactions = useMemo(() => {
    const incomeEntries = income.map((i) => ({
      ...i,
      category: "Income",
      color: "green",
    }));
    const expenseEntries = expenses.map((e) => ({
      ...e,
      category: "Expense",
      color: "red",
    }));
    return [...incomeEntries, ...expenseEntries]
      .sort((a, b) => {
        const bDate = getTransactionDateObject(b);
        const aDate = getTransactionDateObject(a);
        return (bDate?.getTime() ?? 0) - (aDate?.getTime() ?? 0);
      })
      .slice(0, 10);
  }, [income, expenses]);

  const getExpenseSummary = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const getTotal = (items) =>
      items.reduce((s, i) => s + parseAmount(i.amount), 0);

    const filterItemsByRange = (items, from, to) =>
      items.filter((i) => {
        const d = getTransactionDateObject(i);
        return d && d >= from && d <= to;
      });

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yesterdayExpenses = expenses.filter((i) => {
      const d = getTransactionDateObject(i);
      return d && isSameDay(d, yesterday);
    });

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const thisWeekExpenses = filterItemsByRange(expenses, startOfWeek, now);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthExpenses = filterItemsByRange(expenses, startOfMonth, now);

    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const thisYearExpenses = filterItemsByRange(expenses, startOfYear, now);

    const fmt = (n) => `Rs. ${n.toLocaleString()}`;

    return [
      {
        period: "Yesterday",
        current: fmt(getTotal(yesterdayExpenses)),
      },
      {
        period: "This Week",
        current: fmt(getTotal(thisWeekExpenses)),
      },
      {
        period: "This Month",
        current: fmt(getTotal(thisMonthExpenses)),
      },
      {
        period: "This Year",
        current: fmt(getTotal(thisYearExpenses)),
      },
    ];
  }, [expenses]);

  return (
    <DataContext.Provider
      value={{
        customers,
        addCustomer,
        vendors,
        addVendor,
        projects,
        addProject,
        updateProject,
        employees,
        addEmployee,
        invoices,
        addInvoice,
        updateInvoice,
        income,
        addIncome,
        updateIncome,
        expenses,
        addExpense,
        updateExpense,
        totalIncome,
        totalExpenses,
        grossProfit,
        totalReceivable,
        totalPayables,
        totalPaidInvoices,
        totalPendingInvoices,
        monthlyChartData,
        weeklyChartData,
        recentTransactions,
        getExpenseSummary,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
