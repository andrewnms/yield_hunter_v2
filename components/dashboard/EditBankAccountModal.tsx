'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankAccount } from '@/store/bankAccountStore';

interface EditBankAccountModalProps {
  account: BankAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<BankAccount>) => void;
  onDelete: (id: number) => void;
}

interface ValidationError {
  balance?: string;
  yieldRate?: string;
}

const MAX_BALANCE = 1000000000; // 1 billion PHP
const MAX_YIELD_RATE = 35; // 35%

export default function EditBankAccountModal({
  account,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EditBankAccountModalProps) {
  const [balance, setBalance] = useState('');
  const [yieldRate, setYieldRate] = useState('');
  const [errors, setErrors] = useState<ValidationError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setBalance(account.balance.toString());
      setYieldRate(account.yieldRate.toString());
    }
    setShowDeleteConfirm(false);
    setErrors({});
    setTouched({});
  }, [account]);

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'balance':
        const balanceNum = parseFloat(value);
        if (!value) {
          return 'Balance is required';
        }
        if (isNaN(balanceNum)) {
          return 'Please enter a valid number';
        }
        if (balanceNum <= 0) {
          return 'Balance must be greater than 0';
        }
        if (balanceNum > MAX_BALANCE) {
          return `Balance cannot exceed ${new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
          }).format(MAX_BALANCE)}`;
        }
        break;

      case 'yieldRate':
        const yieldNum = parseFloat(value);
        if (!value) {
          return 'Yield rate is required';
        }
        if (isNaN(yieldNum)) {
          return 'Please enter a valid number';
        }
        if (yieldNum < 0) {
          return 'Yield rate cannot be negative';
        }
        if (yieldNum > MAX_YIELD_RATE) {
          return `Yield rate cannot exceed ${MAX_YIELD_RATE}%`;
        }
        break;
    }
  };

  const handleFieldChange = (
    field: string,
    value: string,
    validateImmediately = false
  ) => {
    const updateField = () => {
      switch (field) {
        case 'balance':
          setBalance(value);
          break;
        case 'yieldRate':
          setYieldRate(value);
          break;
      }
    };

    updateField();

    if (touched[field] || validateImmediately) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
    const value = field === 'balance' ? balance : yieldRate;
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError = {
      balance: validateField('balance', balance),
      yieldRate: validateField('yieldRate', yieldRate),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      const updates = {
        balance: parseFloat(balance),
        yieldRate: parseFloat(yieldRate),
      };
      
      try {
        await onSave(updates);
        onClose();
      } finally {
        setIsLoading(false);
      }
    }
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

  const isFormValid = !Object.values(errors).some(error => error !== undefined);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-lg p-6 w-full max-w-md transform"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-black">
              Edit {account?.name}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Balance
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₱</span>
                  <motion.input
                    whileTap={{ scale: 0.995 }}
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => handleFieldChange('balance', e.target.value)}
                    onBlur={() => handleBlur('balance')}
                    className={`w-full p-2 pl-7 border rounded focus:ring-2 focus:ring-primary focus:border-transparent text-black placeholder:text-gray-500 transition-colors duration-200 ${
                      errors.balance && touched.balance ? 'border-red-500' : 'border-gray-300 hover:border-primary'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.balance && touched.balance && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.balance}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Yield Rate
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <motion.input
                    whileTap={{ scale: 0.995 }}
                    type="number"
                    step="0.1"
                    value={yieldRate}
                    onChange={(e) => handleFieldChange('yieldRate', e.target.value)}
                    onBlur={() => handleBlur('yieldRate')}
                    className={`w-full p-2 pr-8 border rounded focus:ring-2 focus:ring-primary focus:border-transparent text-black placeholder:text-gray-500 transition-colors duration-200 ${
                      errors.yieldRate && touched.yieldRate ? 'border-red-500' : 'border-gray-300 hover:border-primary'
                    }`}
                    placeholder="0.0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                {errors.yieldRate && touched.yieldRate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.yieldRate}
                  </motion.p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                    whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded transition-colors duration-200 ${
                      isFormValid
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </motion.button>
                </div>
                <div className="border-t pt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleDelete}
                    className={`w-full px-4 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                      showDeleteConfirm
                        ? 'text-white bg-red-500 hover:bg-red-600'
                        : 'text-black bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    {showDeleteConfirm ? 'Confirm Delete' : 'Delete Account'}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
