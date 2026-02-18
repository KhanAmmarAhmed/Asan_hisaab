import React, { useState } from "react";
import { Edit, Plus } from "lucide-react";
// import Button from "@/components/generic/GenericButton";
import GenericModal from "@/components/generic/GenericModal";
import AccountListItem from "./AccountListItem";
import { Button } from "@mui/material";

const mockAccounts = [
  { id: 1, name: "Cash", type: "cash", balance: "Rs. 10,000/-" },
  { id: 2, name: "Petty Cash", type: "petty-cash", balance: "Rs. 80,000/-" },
  { id: 3, name: "Meezan Bank", type: "bank", balance: "Rs. 20,000/-" },
  { id: 4, name: "Alfalah Bank", type: "bank", balance: "Rs. 15,000/-" },
];

const accountModalFields = [
  {
    id: "accountName",
    label: "Account Name",
    type: "text",
    placeholder: "Enter account name",
    required: true,
  },
  {
    id: "accountType",
    label: "Account Type",
    type: "select",
    placeholder: "Select account type",
    options: ["Cash", "Petty Cash", "Bank"],
    required: true,
  },
  {
    id: "balance",
    label: "Balance",
    type: "number",
    placeholder: "Enter balance amount",
    required: true,
  },
];

export default function CashbookPage() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "Friends It Solutions",
    type: "FIS - IT Company",
  });

  const handleAddAccount = (formData) => {
    console.log("[v0] Adding new account:", formData);
    const newAccount = {
      id: accounts.length + 1,
      name: formData.accountName,
      type: formData.accountType.toLowerCase().replace(/\s+/g, "-"),
      balance: `Rs. ${formData.balance}/-`,
    };
    setAccounts([...accounts, newAccount]);
    setIsModalOpen(false);
  };

  const handleEditCompany = (formData) => {
    console.log("[v0] Editing company info:", formData);
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
          <h2 className="text-2xl font-bold">{companyInfo.name}</h2>
          <p className="text-sm opacity-90">{companyInfo.type}</p>
        </div>
        <button
          variant="contained"
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
              px: 3,
              py: 1,
              borderRadius: 1,
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#2d1b69",
              },
            }}
          >
            <Plus size={25} />
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
            defaultValue: companyInfo.name,
          },
          {
            id: "companyType",
            label: "Company Type",
            type: "text",
            placeholder: "Enter company type",
            required: true,
            defaultValue: companyInfo.type,
          },
        ]}
        onSubmit={handleEditCompany}
        submitButtonLabel="Save"
      />
    </div>
  );
}
