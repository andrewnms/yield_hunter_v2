'use client';

import { useState, useEffect } from 'react';
import { BankAccount } from '@/store/bankAccountStore';

interface EditBankAccountModalProps {
  account: BankAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<BankAccount>) => void;
  onDelete: (id: number) => void;
}

export default function EditBankAccountModal({
  account,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EditBankAccountModalProps) {
  const [balance, setBalance] = useState('');
  const [yieldRate, setYieldRate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (account) {
      setBalance(account.balance.toString());
      setYieldRate(account.yieldRate.toString());
    }
    setShowDeleteConfirm(false);
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates = {
      balance: parseFloat(balance),
      yieldRate: parseFloat(yieldRate),
    };
    onSave(updates);
    onClose();
  };

  const handleDelete = () => {
    if (account && showDeleteConfirm) {
      onDelete(account.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Edit {account?.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1">
              Yield Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={yieldRate}
              onChange={(e) => setYieldRate(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-2">
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
                Save Changes
              </button>
            </div>
            <div className="border-t pt-3">
              <button
                type="button"
                onClick={handleDelete}
                className={`w-full px-4 py-2 text-sm font-medium rounded ${
                  showDeleteConfirm
                    ? 'text-white bg-red-500 hover:bg-red-600'
                    : 'text-black bg-red-50 hover:bg-red-100'
                }`}
              >
                {showDeleteConfirm ? 'Confirm Delete' : 'Delete Account'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
