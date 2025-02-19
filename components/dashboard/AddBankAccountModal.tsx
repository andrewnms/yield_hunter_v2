'use client';

import { useState } from 'react';
import { useBankAccountStore } from '@/store/bankAccountStore';

const digitalBanks = [
  "Maya Bank",
  "UnionDigital Bank",
  "GoTyme Bank",
  "Tonik Digital Bank",
  "GCash (CIMB)",
  "SeaBank",
  "BPI Online",
  "RCBC DiskarTech",
  "Metrobank Online",
  "PNB Digital Banking",
];

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBankAccountModal({
  isOpen,
  onClose,
}: AddBankAccountModalProps) {
  const { addAccount } = useBankAccountStore();
  const [bank, setBank] = useState('');
  const [balance, setBalance] = useState('');
  const [yieldRate, setYieldRate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bank) {
      newErrors.bank = 'Please select a bank';
    }

    const balanceNum = parseFloat(balance);
    if (!balance || isNaN(balanceNum) || balanceNum < 0) {
      newErrors.balance = 'Please enter a valid positive amount';
    }

    const yieldRateNum = parseFloat(yieldRate);
    if (!yieldRate || isNaN(yieldRateNum) || yieldRateNum < 0 || yieldRateNum > 20) {
      newErrors.yieldRate = 'Please enter a valid yield rate between 0% and 20%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addAccount({
        name: bank,
        balance: parseFloat(balance),
        yieldRate: parseFloat(yieldRate),
      });
      
      // Reset form
      setBank('');
      setBalance('');
      setYieldRate('');
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all">
        <h2 className="text-xl font-semibold mb-4 text-black">Add Bank Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Bank Name
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.bank ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a bank</option>
              {digitalBanks.map((bankName) => (
                <option key={bankName} value={bankName}>
                  {bankName}
                </option>
              ))}
            </select>
            {errors.bank && (
              <p className="mt-1 text-sm text-red-500">{errors.bank}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.balance ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter balance"
            />
            {errors.balance && (
              <p className="mt-1 text-sm text-red-500">{errors.balance}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Yield Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={yieldRate}
              onChange={(e) => setYieldRate(e.target.value)}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.yieldRate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter yield rate"
            />
            {errors.yieldRate && (
              <p className="mt-1 text-sm text-red-500">{errors.yieldRate}</p>
            )}
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90"
            >
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
