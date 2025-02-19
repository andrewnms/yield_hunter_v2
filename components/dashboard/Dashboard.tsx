'use client';

import { useState, Suspense, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import FinancialSummary from './FinancialSummary';
import BankAccountList from './BankAccountList';
import AddBankAccountModal from './AddBankAccountModal';
import { useBankAccountStore } from '@/store/bankAccountStore';

// Lazy load charts to improve initial page load
const FundAllocationChart = dynamic(() => import('./FundAllocationChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-white rounded-xl shadow-lg animate-pulse" />
  ),
});

const ProjectedSavingsChart = dynamic(() => import('./ProjectedSavingsChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-white rounded-xl shadow-lg animate-pulse" />
  ),
});

const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { accounts, fetchAccounts, isLoading } = useBankAccountStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const financialData = useMemo(() => {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Calculate projected balance after 40 days
    const projectedBalance = accounts.reduce((sum, account) => {
      const dailyRate = account.yieldRate / 100 / 365;
      const projectedAmount = account.balance * Math.pow(1 + dailyRate, 40);
      return sum + projectedAmount;
    }, 0);
    
    // Calculate weighted average yield
    const averageYield = accounts.length > 0
      ? accounts.reduce((sum, account) => sum + (account.balance * account.yieldRate), 0) / totalBalance
      : 0;
    
    // Find highest yield bank
    const highestYieldBank = accounts.reduce((highest, account) => {
      return account.yieldRate > (highest?.rate || 0)
        ? { bank: account.name, rate: account.yieldRate }
        : highest;
    }, { bank: '', rate: 0 });

    return {
      totalBalance,
      projectedBalance,
      averageYield,
      highestYield: highestYieldBank
    };
  }, [accounts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-[#EE2B47] py-8 px-4 md:px-8 shadow-lg border-b border-[#ee2b4730]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Financial Summary Section */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-white rounded-xl shadow-lg animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <FinancialSummary data={financialData} loading={isLoading} />
          </Suspense>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense
              fallback={
                <div className="h-[300px] bg-white rounded-xl shadow-lg animate-pulse" />
              }
            >
              <FundAllocationChart />
            </Suspense>
            <Suspense
              fallback={
                <div className="h-[300px] bg-white rounded-xl shadow-lg animate-pulse" />
              }
            >
              <ProjectedSavingsChart 
                initialBalance={financialData.totalBalance}
                annualYieldRate={financialData.averageYield}
              />
            </Suspense>
          </div>

          {/* Bank Accounts Section */}
          <div className="relative">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-white rounded-xl shadow-lg animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <BankAccountList />
            </Suspense>

            {/* Floating Add Account Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </motion.button>
          </div>

          {/* Add Bank Account Modal */}
          <AddBankAccountModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
