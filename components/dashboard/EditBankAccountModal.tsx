'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankAccount } from '@/store/bankAccountStore';

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
  const [yieldRate, setYieldRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (account) {
      setBalance(account.balance.toString());
      setYieldRate(account.yieldRate.toString());
    }
  }, [account]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave({
        balance: parseFloat(balance),
        yieldRate: parseFloat(yieldRate),
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

        <form onSubmit={handleSubmit} method="dialog" className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="balance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Balance
              </label>
              <input
                type="number"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                step="0.01"
                min="0"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="yieldRate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Yield Rate (%)
              </label>
              <input
                type="number"
                id="yieldRate"
                value={yieldRate}
                onChange={(e) => setYieldRate(e.target.value)}
                step="0.1"
                min="0"
                max="100"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black text-base"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Delete Account
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </dialog>
  );
}
