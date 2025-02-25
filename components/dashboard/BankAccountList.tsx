'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankAccount, useBankAccountStore } from '@/store/bankAccountStore';
import EditBankAccountModal from './EditBankAccountModal';

export default function BankAccountList() {
  const { accounts, fetchAccounts, updateAccount, deleteAccount, isLoading, error } = useBankAccountStore();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();

    // Refresh accounts every 15 seconds to get updated yield rates
    const intervalId = setInterval(() => {
      fetchAccounts();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchAccounts]);

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updates: Partial<BankAccount>) => {
    if (!selectedAccount) return;
    await updateAccount(selectedAccount.id, updates);
    await fetchAccounts(); // Refresh to get updated yield rate
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDelete = async (id: string) => {
    await deleteAccount(id);
    await fetchAccounts(); // Refresh list after deletion
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatYieldRate = (rate: number | undefined | null) => {
    if (typeof rate !== 'number') return '0.0%';
    return `${rate.toFixed(1)}%`;
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Linked Bank Accounts</h2>
          <button
            onClick={() => fetchAccounts()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="h-24 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Linked Bank Accounts</h2>
          <button
            onClick={() => fetchAccounts()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Error loading accounts: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Linked Bank Accounts</h2>
        <button
          onClick={() => fetchAccounts()}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>
      
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, x: -100 }}
              layout
              className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="font-medium text-lg text-black">{account.name}</h3>
                <div className="mt-1 space-y-1">
                  <p className="text-black">
                    Balance: {formatCurrency(account.balance)}
                  </p>
                  <p className="text-black">
                    Yield Rate: {formatYieldRate(account.yieldRate)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(account)}
                  className="px-3 py-1.5 text-sm font-medium text-black bg-primary/10 rounded hover:bg-primary/20"
                >
                  Edit
                </motion.button>
                <button
                  onClick={() => {}} // Transfer functionality to be implemented
                  className="px-3 py-1.5 text-sm font-medium text-black bg-blue-50 rounded hover:bg-blue-100"
                >
                  Transfer
                </button>
                <button
                  onClick={() => {}} // Open bank functionality to be implemented
                  className="px-3 py-1.5 text-sm font-medium text-black bg-gray-100 rounded hover:bg-gray-200"
                >
                  Open Bank
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <EditBankAccountModal
        account={selectedAccount}
        isOpen={isEditModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
