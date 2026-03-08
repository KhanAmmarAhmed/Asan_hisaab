
import React, { useState, useEffect } from "react";
import { Edit, Plus } from "lucide-react";
import GenericModal from "@/components/generic/GenericModal";
import AccountListItem from "./AccountListItem";
import { Button } from "@mui/material";
import { useContext } from "react";
import { CompanyContext } from "@/context/CompanyContext";
import UBL from "../../assets/banksLogos/UBL.png";
import HBL from "../../assets/banksLogos/HBL.png";
import FaisalBank from "../../assets/banksLogos/fb.png";
import StandardCharter from "../../assets/banksLogos/SC.png";
import BankOfPunjab from "../../assets/banksLogos/BOP.png";
import BankOfIslami from "../../assets/banksLogos/EP.jpg";

const STORAGE_KEY = "cashbook_accounts";

// Bank options with images
const BANK_OPTIONS = [
  {
    label: "UBL",
    value: "UBL",
    image: UBL,
    type: "ubl"
  },
  {
    label: "HBL",
    value: "HBL",
    image: HBL,
    type: "hbl"
  },
  {
    label: "Faisal Bank",
    value: "Faisal Bank",
    image: FaisalBank,
    type: "faisal-bank"
  },
  {
    label: "Standard Charter",
    value: "Standard Charter",
    image: StandardCharter,
    type: "standard-charter"
  },
  {
    label: "Bank of Punjab",
    value: "Bank of Punjab",
    image: BankOfPunjab,
    type: "bank-of-punjab"
  },
  {
    label: "Bank of Islami",
    value: "Bank of Islami",
    image: BankOfIslami,
    type: "bank-of-islami"
  },
];

const getInitialAccounts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [
    {
      id: 1,
      name: "Alfalah Bank",
      type: "bank",
      balance: "Rs. 15,000/-",
      bankType: "alfalah",
      accountNumber: "1234567890"
    },
  ];
};

const accountModalFields = [
  {
    id: "selectBank",
    label: "Select Bank",
    type: "select",
    placeholder: "Select Bank",
    options: BANK_OPTIONS.map(bank => bank.label), // Just the labels for the select
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
    label: "Account Number",
    type: "number",
    placeholder: "Enter account number",
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

export default function CashbookPage() {
  const [accounts, setAccounts] = useState(getInitialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const { companyInfo, setCompanyInfo } = useContext(CompanyContext);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  // Helper function to get bank details by label
  const getBankDetails = (bankLabel) => {
    return BANK_OPTIONS.find(bank => bank.label === bankLabel) || BANK_OPTIONS[0];
  };

  const handleAddAccount = (formData) => {
    console.log("[v0] Adding new account:", formData);

    const selectedBank = getBankDetails(formData.selectBank);

    const newAccount = {
      id: Date.now(),
      name: formData.accountName,
      bankLabel: formData.selectBank,
      bankType: selectedBank.type,
      bankImage: selectedBank.image,
      type: "bank",
      accountNumber: formData.accountNumber,
      balance: `Rs. ${Number(formData.balance).toLocaleString()}/-`,
    };

    setAccounts([...accounts, newAccount]);
    setIsModalOpen(false);
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
          <h2 className="text-2xl font-bold">{companyInfo?.name || "Company Name"}</h2>
          <p className="text-sm opacity-90">{companyInfo?.type || "Company Type"}</p>
        </div>
        <button
          onClick={() => setIsEditingCompany(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Edit company info"
        >
          <Edit size={30} />
        </button>
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
            <AccountListItem
              key={account.id}
              account={account}
              index={index}
            />
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