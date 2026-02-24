import React, { createContext, useState, useEffect, useMemo } from "react";

export const DataContext = createContext();

// Helper to parse amount strings like "Rs. 40,000" or numbers into a numeric value
export const parseAmount = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    console.log(val);
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
};

export const DataProvider = ({ children }) => {
    // --- Initialize state from localStorage or default ---
    const [customers, setCustomers] = useState(() => {
        const saved = localStorage.getItem("customers");
        return saved ? JSON.parse(saved) : [
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
        return saved ? JSON.parse(saved) : [
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
        return saved ? JSON.parse(saved) : [
            { name: "Friends It Solutions", type: "FIS - IT Company" },
            { name: "BSB", type: "FIS - IT Company" },
            { name: "Business Solutions", type: "FIS - IT Company" },
        ];
    });

    const [employees, setEmployees] = useState(() => {
        const saved = localStorage.getItem("employees");
        return saved ? JSON.parse(saved) : [
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
    useEffect(() => localStorage.setItem("customers", JSON.stringify(customers)), [customers]);
    useEffect(() => localStorage.setItem("vendors", JSON.stringify(vendors)), [vendors]);
    useEffect(() => localStorage.setItem("projects", JSON.stringify(projects)), [projects]);
    useEffect(() => localStorage.setItem("employees", JSON.stringify(employees)), [employees]);
    useEffect(() => localStorage.setItem("invoices", JSON.stringify(invoices)), [invoices]);
    useEffect(() => localStorage.setItem("income", JSON.stringify(income)), [income]);
    useEffect(() => localStorage.setItem("expenses", JSON.stringify(expenses)), [expenses]);

    // --- Helper Actions ---
    const addCustomer = (customer) => setCustomers(prev => [customer, ...prev]);
    const addVendor = (vendor) => setVendors(prev => [vendor, ...prev]);
    const addProject = (project) => setProjects(prev => [...prev, project]);
    const updateProject = (index, updatedProject) => {
        setProjects(prev => prev.map((p, i) => i === index ? updatedProject : p));
    };
    const addEmployee = (employee) => setEmployees(prev => [employee, ...prev]);
    const addInvoice = (invoice) => setInvoices(prev => [invoice, ...prev]);
    const updateInvoice = (index, updated) => setInvoices(prev => prev.map((inv, i) => i === index ? updated : inv));
    const addIncome = (entry) => setIncome(prev => [entry, ...prev]);
    const addExpense = (entry) => setExpenses(prev => [entry, ...prev]);

    // --- Computed Financial Summaries ---
    const totalIncome = useMemo(() =>
        income.reduce((sum, item) => sum + parseAmount(item.amount), 0),
        [income]
    );

    const totalExpenses = useMemo(() =>
        expenses.reduce((sum, item) => sum + parseAmount(item.amount), 0),
        [expenses]
    );

    const grossProfit = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

    // Total receivable: "Paid" invoices (Sales type)
    const totalReceivable = useMemo(() =>
        invoices
            .filter(inv => inv.entityType === "Customer" || inv.type?.toLowerCase().includes("sales"))
            .reduce((sum, inv) => sum + parseAmount(inv.ammount), 0),
        [invoices]
    );

    // Total payables: invoices owed to suppliers/vendors
    const totalPayables = useMemo(() =>
        invoices
            .filter(inv => inv.entityType === "Supplier" || inv.type?.toLowerCase().includes("purchase"))
            .reduce((sum, inv) => sum + parseAmount(inv.ammount), 0),
        [invoices]
    );

    const totalPaidInvoices = useMemo(() =>
        invoices.filter(inv => inv.status === "Paid").reduce((sum, i) => sum + parseAmount(i.ammount), 0),
        [invoices]
    );

    const totalPendingInvoices = useMemo(() =>
        invoices.filter(inv => inv.status === "Pending").reduce((sum, i) => sum + parseAmount(i.ammount), 0),
        [invoices]
    );

    // Monthly chart data derived from real income + expense entries
    const monthlyChartData = useMemo(() => {
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const incomeMap = {};
        const expenseMap = {};

        income.forEach(item => {
            const date = new Date(item.date);
            if (!isNaN(date)) {
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                incomeMap[key] = (incomeMap[key] || 0) + parseAmount(item.amount);
            }
        });

        expenses.forEach(item => {
            const date = new Date(item.date);
            if (!isNaN(date)) {
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                expenseMap[key] = (expenseMap[key] || 0) + parseAmount(item.amount);
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

    // Recent transactions: merge income and expenses, sorted by date, latest 10
    const recentTransactions = useMemo(() => {
        const incomeEntries = income.map(i => ({ ...i, category: "Income", color: "green" }));
        const expenseEntries = expenses.map(e => ({ ...e, category: "Expense", color: "red" }));
        return [...incomeEntries, ...expenseEntries]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
    }, [income, expenses]);

    // Expense breakdowns by time period helper
    const getExpenseSummary = useMemo(() => {
        const now = new Date();
        const getTotal = (items) => items.reduce((s, i) => s + parseAmount(i.amount), 0);

        const todayStr = now.toISOString().split("T")[0];
        const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfLastWeek = new Date(startOfWeek); startOfLastWeek.setDate(startOfWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfWeek); endOfLastWeek.setDate(startOfWeek.getDate() - 1);

        const filterItems = (items, from, to) => items.filter(i => {
            const d = new Date(i.date);
            return d >= from && d <= to;
        });

        const todayExpenses = expenses.filter(i => i.date === todayStr);
        const yesterdayExpenses = expenses.filter(i => i.date === yesterdayStr);
        const thisWeekExpenses = filterItems(expenses, startOfWeek, now);
        const lastWeekExpenses = filterItems(expenses, startOfLastWeek, endOfLastWeek);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const thisMonthExpenses = filterItems(expenses, startOfMonth, now);
        const lastMonthExpenses = filterItems(expenses, startOfLastMonth, endOfLastMonth);

        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
        const thisYearExpenses = filterItems(expenses, startOfYear, now);
        const lastYearExpenses = filterItems(expenses, startOfLastYear, endOfLastYear);

        const fmt = (n) => `Rs. ${n.toLocaleString()}`;

        return [
            { period: "Today", current: fmt(getTotal(todayExpenses)), previous: fmt(getTotal(yesterdayExpenses)), label: "Yesterday" },
            { period: "This Week", current: fmt(getTotal(thisWeekExpenses)), previous: fmt(getTotal(lastWeekExpenses)), label: "Last Week" },
            { period: "This Month", current: fmt(getTotal(thisMonthExpenses)), previous: fmt(getTotal(lastMonthExpenses)), label: "Last Month" },
            { period: "This Year", current: fmt(getTotal(thisYearExpenses)), previous: fmt(getTotal(lastYearExpenses)), label: "Last Year" },
        ];
    }, [expenses]);

    return (
        <DataContext.Provider value={{
            // Entities
            customers, addCustomer,
            vendors, addVendor,
            projects, addProject, updateProject,
            employees, addEmployee,
            invoices, addInvoice, updateInvoice,
            income, addIncome,
            expenses, addExpense,
            // Computed financials
            totalIncome,
            totalExpenses,
            grossProfit,
            totalReceivable,
            totalPayables,
            totalPaidInvoices,
            totalPendingInvoices,
            monthlyChartData,
            recentTransactions,
            getExpenseSummary,
        }}>
            {children}
        </DataContext.Provider>
    );
};
