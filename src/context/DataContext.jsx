import React, { createContext, useState, useEffect, useMemo } from "react";

export const DataContext = createContext();

// Helper to parse amount strings like "Rs. 40,000" or numbers into a numeric value
export const parseAmount = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

export const DataProvider = ({ children }) => {
  // --- Initialize state from localStorage or default ---
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved
      ? JSON.parse(saved)
      : [
          {
            customerName: "Muhammad Usman",
            phone: "03048973476",
            email: "usman123@gmail.com",
            address: "Rawalpindi",
            date: "2024-01-10",
          },
          {
            customerName: "Ehtesham Ali",
            phone: "03157629450",
            email: "ehteshamali@gmail.com",
            address: "Mianwali",
            date: "2024-01-15",
          },
        ];
  });

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem("vendors");
    return saved
      ? JSON.parse(saved)
      : [
          {
            venderName: "Muhammad Usman",
            phone: "03048973476",
            email: "usman123@gmail.com",
            address: "Rawalpindi",
            date: "2024-01-10",
          },
          {
            venderName: "Ehtesham Ali",
            phone: "03157629450",
            email: "ehteshamali@gmail.com",
            address: "Mianwali",
            date: "2024-01-15",
          },
        ];
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Friends It Solutions", type: "FIS - IT Company" },
          { name: "BSB", type: "FIS - IT Company" },
          { name: "Business Solutions", type: "FIS - IT Company" },
        ];
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved
      ? JSON.parse(saved)
      : [
          {
            employeeName: "Muhammad Usman",
            phone: "03048973476",
            email: "usman123@gmail.com",
            address: "Rawalpindi",
            date: "2024-01-10",
          },
          {
            employeeName: "Ehtesham Ali",
            phone: "03157629450",
            email: "ehteshamali@gmail.com",
            address: "Mianwali",
            date: "2024-01-15",
          },
        ];
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem("income");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence Hooks ---
  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("vendors", JSON.stringify(vendors));
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("income", JSON.stringify(income));
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [customers, vendors, projects, employees, invoices, income, expenses]);

  // --- Helper Actions ---
  const addCustomer = (customer) => setCustomers((prev) => [customer, ...prev]);
  const addVendor = (vendor) => setVendors((prev) => [vendor, ...prev]);
  const addProject = (project) => setProjects((prev) => [...prev, project]);
  const updateProject = (index, updatedProject) => {
    setProjects((prev) =>
      prev.map((p, i) => (i === index ? updatedProject : p)),
    );
  };
  const addEmployee = (employee) => setEmployees((prev) => [employee, ...prev]);
  const addInvoice = (invoice) => setInvoices((prev) => [invoice, ...prev]);
  const updateInvoice = (index, updated) =>
    setInvoices((prev) => prev.map((inv, i) => (i === index ? updated : inv)));
  const addIncome = (entry) => setIncome((prev) => [entry, ...prev]);
  const addExpense = (entry) => setExpenses((prev) => [entry, ...prev]);
  console.log(
    "expense:",
    expenses.map((d) => (d.amount !== undefined ? d.amount : d.ammount)),
  );

  // --- Computed Financial Summaries ---
  const totalIncome = useMemo(
    () =>
      income.reduce((sum, item) => {
        const val = item.amount !== undefined ? item.amount : item.ammount;
        return sum + parseAmount(val);
      }, 0),
    [income],
  );

  const totalExpenses = useMemo(
    () =>
      expenses.reduce((sum, item) => {
        const val = item.amount !== undefined ? item.amount : item.ammount;
        return sum + parseAmount(val);
      }, 0),
    [expenses],
  );

  const grossProfit = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses],
  );

  // Total receivable: "Paid" invoices (Sales type)
  const totalReceivable = useMemo(
    () =>
      invoices
        .filter(
          (inv) =>
            inv.entityType === "Customer" ||
            inv.type?.toLowerCase().includes("sales"),
        )
        .reduce((sum, inv) => {
          const val = inv.ammount !== undefined ? inv.ammount : inv.amount;
          return sum + parseAmount(val);
        }, 0),
    [invoices],
  );

  // Total payables: invoices owed to suppliers/vendors
  const totalPayables = useMemo(
    () =>
      invoices
        .filter(
          (inv) =>
            inv.entityType === "Supplier" ||
            inv.type?.toLowerCase().includes("purchase"),
        )
        .reduce((sum, inv) => {
          const val = inv.ammount !== undefined ? inv.ammount : inv.amount;
          return sum + parseAmount(val);
        }, 0),
    [invoices],
  );

  const totalPaidInvoices = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "Paid")
        .reduce((sum, i) => {
          const val = i.ammount !== undefined ? i.ammount : i.amount;
          return sum + parseAmount(val);
        }, 0),
    [invoices],
  );

  const totalPendingInvoices = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "Pending")
        .reduce((sum, i) => {
          const val = i.ammount !== undefined ? i.ammount : i.amount;
          return sum + parseAmount(val);
        }, 0),
    [invoices],
  );

  // Monthly chart data derived from real income + expense entries
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
      const date = new Date(item.date || item.createdAt);
      if (!isNaN(date)) {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const val = item.amount !== undefined ? item.amount : item.ammount;
        incomeMap[key] = (incomeMap[key] || 0) + parseAmount(val);
      }
    });

    expenses.forEach((item) => {
      const date = new Date(item.date || item.createdAt);
      if (!isNaN(date)) {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const val = item.amount !== undefined ? item.amount : item.ammount;
        expenseMap[key] = (expenseMap[key] || 0) + parseAmount(val);
      }
    });

    // Show last 12 months
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

  // --- NEW: Weekly chart data ---
  const weeklyChartData = useMemo(() => {
    // Helper: get the Sunday of the week for a given date
    const getWeekStart = (date) => {
      const d = new Date(date);
      const day = d.getDay(); // 0 = Sunday
      d.setDate(d.getDate() - day);
      return d;
    };

    const incomeMap = {};
    const expenseMap = {};

    // Aggregate income by week start (Sunday)
    income.forEach((item) => {
      const date = new Date(item.date || item.createdAt);
      if (!isNaN(date)) {
        const weekStart = getWeekStart(date);
        const key = weekStart.toISOString().split("T")[0]; // YYYY-MM-DD
        const val = item.amount !== undefined ? item.amount : item.ammount;
        incomeMap[key] = (incomeMap[key] || 0) + parseAmount(val);
      }
    });

    // Aggregate expenses by week start
    expenses.forEach((item) => {
      const date = new Date(item.date || item.createdAt);
      if (!isNaN(date)) {
        const weekStart = getWeekStart(date);
        const key = weekStart.toISOString().split("T")[0];
        const val = item.amount !== undefined ? item.amount : item.ammount;
        expenseMap[key] = (expenseMap[key] || 0) + parseAmount(val);
      }
    });

    // Build the last 12 weeks (enough for a 7‑week view)
    const result = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7); // go back i weeks
      const weekStart = getWeekStart(d);
      const key = weekStart.toISOString().split("T")[0];

      // Format label as "MMM D" (e.g., "Feb 10")
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

  // Recent transactions: merge income and expenses, sorted by date, latest 10
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
      .sort(
        (a, b) =>
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
      )
      .slice(0, 10);
  }, [income, expenses]);

  // Expense breakdowns by time period helper
  const getExpenseSummary = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const getTotal = (items) =>
      items.reduce((s, i) => {
        const val = i.amount !== undefined ? i.amount : i.ammount;
        return s + parseAmount(val);
      }, 0);

    const filterItemsByRange = (items, from, to) =>
      items.filter((i) => {
        const d = new Date(i.date || i.createdAt);
        return !isNaN(d) && d >= from && d <= to;
      });

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yesterdayExpenses = expenses.filter((i) => {
      const d = new Date(i.date || i.createdAt);
      return !isNaN(d) && isSameDay(d, yesterday);
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
        // Entities
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
        expenses,
        addExpense,
        // Computed financials
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
