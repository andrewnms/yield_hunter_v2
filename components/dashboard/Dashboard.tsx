'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import FinancialSummary from './FinancialSummary';
import BankAccountList from './BankAccountList';
import AddBankAccountModal from './AddBankAccountModal';

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

interface DashboardProps {
  data: {
    totalBalance: number;
    projectedBalance: number;
    averageYield: number;
    highestYield: {
      bank: string;
      rate: number;
    };
  };
}

const Dashboard = ({ data }: DashboardProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
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
          <FinancialSummary data={data} />
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
              initialBalance={data.totalBalance}
              annualYieldRate={data.averageYield}
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
  );
};

export default Dashboard;
