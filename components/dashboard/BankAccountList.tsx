'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankAccount, useBankAccountStore } from '@/store/bankAccountStore';
import EditBankAccountModal from './EditBankAccountModal';

export default function BankAccountList() {
  const { accounts, updateAccount, deleteAccount } = useBankAccountStore();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Linked Bank Accounts</h2>
      
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
                    Yield Rate: {account.yieldRate.toFixed(1)}%
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
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
        onSave={(updates) => {
          if (selectedAccount) {
            updateAccount(selectedAccount.id, updates);
          }
        }}
        onDelete={deleteAccount}
      />
    </div>
  );
}
