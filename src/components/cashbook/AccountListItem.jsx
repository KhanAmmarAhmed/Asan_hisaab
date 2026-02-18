import React from "react";
import { DollarSign, Banknote, PiggyBank, Building2 } from "lucide-react";

const iconMap = {
  cash: DollarSign,
  "petty-cash": PiggyBank,
  bank: Building2,
};

export default function AccountListItem({ account, index }) {
  const Icon = iconMap[account.type] || DollarSign;

  return (
    <div
      className={`flex items-center gap-4 pr-6 rounded-lg hover:bg-gray-50 bg-[#FFFFFF] transition shadow-sm`}
    >
      <div className="bg-[#1B0D3F] rounded-lg p-3 flex-shrink-0">
        <Icon size={40} className="text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-[#1B0D3F]">{account.name}</h4>
      </div>
      <div className="text-right">
        <p className="text-green-600 font-semibold">{account.balance}</p>
      </div>
    </div>
  );
}
