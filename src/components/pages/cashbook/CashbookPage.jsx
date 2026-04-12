import React, { useState, useEffect, useContext } from "react";
// import React, { useState, useEffect } from "react";
import { Edit, Plus } from "lucide-react";
import GenericModal from "@/components/generic/GenericModal";
import AccountListItem from "./AccountListItem";
import { Button } from "@mui/material";
// import { useContext } from "react";
import { CompanyContext } from "@/context/CompanyContext";
import UBL from "../../assets/banksLogos/UBL.png";
import HBL from "../../assets/banksLogos/HBL.png";
import FaisalBank from "../../assets/banksLogos/fb.png";
import StandardCharter from "../../assets/banksLogos/SC.png";
import BankOfPunjab from "../../assets/banksLogos/BOP.png";
import BankOfIslami from "../../assets/banksLogos/EP.jpg";

import {
  addBankAccountApi,
  fetchBankAccountsApi,
} from "@/services/bankAccountApi";

const STORAGE_KEY = "cashbook_accounts";

// Bank options — labels MUST match the bank_name values returned by the API
// exactly so that the name-based lookup in mapApiAccountToUi always resolves.
const BANK_OPTIONS = [
  {
    label: "UBL",
    value: "UBL",
    image: UBL,
    type: "ubl",
    bankId: 4, // backend bank_id for UBL
  },
  {
    label: "HBL",
    value: "HBL",
    image: HBL,
    type: "hbl",
    bankId: 3, // backend bank_id for HBL
  },
  // {
  //   label: "Faisal Bank",
  //   value: "Faisal Bank",
  //   image: FaisalBank,
  //   type: "faisal-bank",
  //   bankId: 2,          // backend bank_id for Faisal Bank
  // },
  // {
  //   label: "Standard Chartered",
  //   value: "Standard Chartered",
  //   image: StandardCharter,
  //   type: "standard-chartered",
  //   bankId: 1,          // backend bank_id for Standard Chartered
  // },
  // {
  //   label: "Bank of Punjab",
  //   value: "Bank of Punjab",
  //   image: BankOfPunjab,
  //   type: "bank-of-punjab",
  //   bankId: 5,          // backend bank_id for Bank of Punjab
  // },
  // {
  //   label: "Bank of Islami",
  //   value: "Bank of Islami",
  //   image: BankOfIslami,
  //   type: "bank-of-islami",
  //   bankId: 6,
  // },
];

// Fast O(1) lookup: bank_name (lowercase) → BANK_OPTIONS entry
const BANK_BY_NAME = Object.fromEntries(
  BANK_OPTIONS.map((b) => [b.label.toLowerCase(), b]),
);

// Fast O(1) lookup: bank_id (string) → BANK_OPTIONS entry
const BANK_BY_ID = Object.fromEntries(
  BANK_OPTIONS.map((b) => [String(b.bankId), b]),
);

const getInitialAccounts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

const accountModalFields = [
  {
    id: "selectBank",
    label: "Select Bank",
    type: "select",
    placeholder: "Select Bank",
    options: BANK_OPTIONS.map((bank) => bank.label), // Just the labels for the select
    required: true,
  },
  {
    id: "accountName",
    label: "Account Name",
    type: "text",
    placeholder: "Enter account name",
    required: true,
  },
  {
    id: "accountNumber",
    label: "Account Number / IBAN",
    type: "text",
    placeholder: "Enter account number or IBAN",
    required: true,
  },
  {
    id: "balance",
    label: "Initial Balance",
    type: "number",
    placeholder: "Enter balance amount",
    required: true,
  },
];

const toNumberOrNull = (value) => {
  if (value === undefined || value === null) return null;
  const n = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
};

const formatRs = (amount) => {
  const n = toNumberOrNull(amount);
  if (n === null) return `Rs. ${String(amount ?? 0)}/-`;
  return `Rs. ${n.toLocaleString()}/-`;
};

export default function CashbookPage() {
  const [accounts, setAccounts] = useState(getInitialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const { companyInfo, setCompanyInfo } = useContext(CompanyContext);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  // }, [accounts]);

  useEffect(() => {
    let isMounted = true;

    const mapApiAccountToUi = (acc) => {
      // Prioritise bank_name (authoritative text from DB) over bank_id
      // because the frontend bankId values must match the backend exactly.
      const bankNameFromApi =
        acc?.bank_name ?? acc?.bankName ?? acc?.bank_label ?? acc?.bankLabel;
      const bankIdFromApi = acc?.bank_id ?? acc?.bankId ?? acc?.bankID;

      const bankDetails =
        (bankNameFromApi
          ? BANK_BY_NAME[bankNameFromApi.toLowerCase()] ||
            BANK_OPTIONS.find((b) =>
              b.label.toLowerCase().includes(bankNameFromApi.toLowerCase()),
            )
          : null) ||
        (bankIdFromApi ? BANK_BY_ID[String(bankIdFromApi)] : null) ||
        null; // unknown bank → will show generic icon

      const accountTitle =
        acc?.account_title ?? acc?.accountTitle ?? acc?.name ?? "";
      // Prefer IBAN (fuller identifier) over account_number when available.
      const accountNumber =
        acc?.iban ??
        acc?.IBAN ??
        acc?.account_number ??
        acc?.accountNumber ??
        "";
      const openingBalance =
        acc?.opening_balance ?? acc?.openingBalance ?? acc?.balance ?? 0;

      return {
        id:
          acc?.id ??
          acc?.account_id ??
          acc?.bank_account_id ??
          acc?.bankAccountId ??
          Date.now() + Math.random(),
        name: accountTitle,
        bankLabel: bankDetails?.label ?? bankNameFromApi ?? "",
        bankType: bankDetails?.type ?? "",
        bankImage: bankDetails?.image ?? null,
        type: "bank",
        accountNumber,
        balance: formatRs(openingBalance),
      };
    };

    (async () => {
      try {
        const list = await fetchBankAccountsApi();
        if (!isMounted) return;
        setAccounts(Array.isArray(list) ? list.map(mapApiAccountToUi) : []);
      } catch (err) {
        console.warn("Failed to fetch bank accounts:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper: resolve bank details from a label/name string (case-insensitive)
  const getBankDetails = (bankLabel) => {
    if (!bankLabel) return BANK_OPTIONS[0];
    return (
      BANK_BY_NAME[bankLabel.toLowerCase()] ||
      BANK_OPTIONS.find((b) =>
        b.label.toLowerCase().includes(bankLabel.toLowerCase()),
      ) ||
      BANK_OPTIONS[0]
    );
  };

  const handleAddAccount = async (formData) => {
    setApiLoading(true);
    setApiError("");

    const selectedBank = getBankDetails(formData.selectBank);

    try {
      const response = await addBankAccountApi({
        bankId: selectedBank?.bankId,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        iban: formData.accountNumber,
        balance: formData.balance,
        description: "",
        status: 1,
      });

      const created = Array.isArray(response) ? response[0] : response;
      const openingBalance =
        created?.opening_balance ??
        created?.openingBalance ??
        created?.balance ??
        formData.balance;

      const newAccount = {
        id:
          created?.id ??
          created?.account_id ??
          created?.bank_account_id ??
          created?.bankAccountId ??
          Date.now(),
        name:
          created?.account_title ??
          created?.accountTitle ??
          formData.accountName,
        bankLabel: formData.selectBank,
        bankType: selectedBank.type,
        bankImage: selectedBank.image,
        type: "bank",
        accountNumber:
          created?.account_number ??
          created?.accountNumber ??
          created?.iban ??
          formData.accountNumber,
        balance: formatRs(openingBalance),
      };

      setAccounts((prev) => [...prev, newAccount]);
      setIsModalOpen(false);
    } catch (err) {
      setApiError(err?.message || "Failed to add bank account");
    } finally {
      setApiLoading(false);
    }
  };

  const handleEditCompany = (formData) => {
    setCompanyInfo({
      name: formData.companyName,
      type: formData.companyType,
    });
    setIsEditingCompany(false);
  };

  return (
    <div className="space-y-4">
      {/* Company Info Card */}
      <div className="bg-gradient-to-r from-[#1B0D3F] to-[#261758] text-white rounded-lg p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {companyInfo?.name || "Company Name"}
          </h2>
          <p className="text-sm opacity-90">
            {companyInfo?.type || "Company Type"}
          </p>
        </div>
        {/* <button
          onClick={() => setIsEditingCompany(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Edit company info"
        >
          <Edit size={30} />
        </button> */}
      </div>

      {/* Closing Balance Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#1B0D3F]">Closing Balance</h3>
          <Button
            variant="contained"
            onClick={() => setIsModalOpen(true)}
            sx={{
              backgroundColor: "#1f0f46",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 0.5,
              textTransform: "none",
              gap: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#2d1b69",
              },
            }}
          >
            <Plus size={18} />
            Add
          </Button>
        </div>

        {/* Account List */}
        <div className="space-y-2">
          {accounts.map((account, index) => (
            <AccountListItem key={account.id} account={account} index={index} />
          ))}
        </div>
      </div>

      {/* Add Account Modal */}
      <GenericModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Account"
        fields={accountModalFields}
        onSubmit={handleAddAccount}
        submitButtonLabel="Add"
        loading={apiLoading}
        error={apiError}
      />

      {/* Edit Company Modal */}
      <GenericModal
        open={isEditingCompany}
        onOpenChange={setIsEditingCompany}
        title="Edit Company Information"
        fields={[
          {
            id: "companyName",
            label: "Company Name",
            type: "text",
            placeholder: "Enter company name",
            required: true,
            defaultValue: companyInfo?.name || "",
          },
          {
            id: "companyType",
            label: "Company Type",
            type: "text",
            placeholder: "Enter company type",
            required: true,
            defaultValue: companyInfo?.type || "",
          },
        ]}
        onSubmit={handleEditCompany}
        submitButtonLabel="Save"
      />
    </div>
  );
}
