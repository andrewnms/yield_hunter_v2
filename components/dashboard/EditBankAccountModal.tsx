'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankAccount } from '@/store/bankAccountStore';

interface YieldRate {
  bankName: string;
  accountType: string;
  rate: number;
}

interface Props {
  account: BankAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<BankAccount>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function EditBankAccountModal({
  account,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [balance, setBalance] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [availableRates, setAvailableRates] = useState<YieldRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (account) {
      setBalance(account.balance.toString());
      setBankName(account.bankName || '');
      setAccountType(account.accountType || '');
    }
  }, [account]);

  useEffect(() => {
    fetchAvailableRates();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const fetchAvailableRates = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/yield-rates');
      if (response.ok) {
        const data = await response.json();
        setAvailableRates(data);
      }
    } catch (error) {
      console.error('Failed to fetch yield rates:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave({
        balance: parseFloat(balance),
        bankName,
        accountType,
      });
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!account) return;
    
    if (window.confirm('Are you sure you want to delete this account?')) {
      setIsLoading(true);
      try {
        await onDelete(account.id);
        onClose();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const availableBanks = [...new Set(availableRates.map(rate => rate.bankName))];
  const availableAccountTypes = availableRates
    .filter(rate => rate.bankName === bankName)
    .map(rate => rate.accountType);

  const currentRate = availableRates.find(
    rate => rate.bankName === bankName && rate.accountType === accountType
  )?.rate || 0;

  if (!account) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-transparent p-4 backdrop:bg-black backdrop:bg-opacity-30"
      onClose={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mx-auto w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Edit {account.name}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                Bank
              </label>
              <select
                id="bank"
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  setAccountType(''); // Reset account type when bank changes
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a bank</option>
                {availableBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                disabled={!bankName}
              >
                <option value="">Select an account type</option>
                {availableAccountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {currentRate > 0 && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Current yield rate: <span className="font-semibold">{currentRate}%</span>
                </p>
              </div>
            )}

            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                Balance
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="balance"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Delete Account
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </dialog>
  );
}
