


import React from "react";
import { Building2, CreditCard } from "lucide-react";

export default function AccountListItem({ account, index }) {
  // Use bank image if available, otherwise use default icon
  const hasImage = account.bankImage;

  return (
    <div
      className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 bg-[#FFFFFF] transition shadow-sm border border-gray-100`}
    >
      {/* Bank Logo/Icon */}
      <div className={`${hasImage ? 'bg-white' : 'bg-[#1B0D3F]'} rounded-lg p-2 flex-shrink-0 w-16 h-16 flex items-center justify-center`}>
        {hasImage ? (
          <img
            src={account.bankImage}
            alt={account.bankLabel || account.name}
            className="w-16 h-16 object-contain"
          />
        ) : (
          <Building2 size={40} className="text-white" />
        )}
      </div>

      {/* Account Details */}
      <div className="flex-1">
        <h4 className="font-semibold text-[#1B0D3F]">{account.name}</h4>
        {account.accountNumber && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <CreditCard size={14} />
            Account: {account.accountNumber}
          </p>
        )}
        {account.bankLabel && (
          <p className="text-xs text-gray-400">{account.bankLabel}</p>
        )}
      </div>

      {/* Balance */}
      <div className="text-right">
        <p className="text-green-600 font-semibold">{account.balance}</p>
      </div>
    </div>
  );
}