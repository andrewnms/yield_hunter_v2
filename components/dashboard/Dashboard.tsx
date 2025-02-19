'use client';

import { Suspense, useState } from 'react';
import FinancialSummary from './FinancialSummary';
import dynamic from 'next/dynamic';
import BankAccountList from './BankAccountList';
import AddBankAccountModal from './AddBankAccountModal';

// Use dynamic import for the chart components
const FundAllocationChart = dynamic(
  () => import('./FundAllocationChart'),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="flex justify-center items-center h-[300px]">
          <div className="w-48 h-48 rounded-full bg-gray-200"></div>
        </div>
      </div>
    ),
  }
);

const ProjectedSavingsChart = dynamic(
  () => import('./ProjectedSavingsChart'),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-[300px] bg-gray-100 rounded"></div>
      </div>
    ),
  }
);

// Dummy bank data for the pie chart
const bankData = [
  { name: "Maya Bank", balance: 50000 },
  { name: "UnionDigital", balance: 30000 },
  { name: "GCash (CIMB)", balance: 70000 },
  { name: "Tonik Bank", balance: 45000 },
];

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
    <div className="p-6 relative min-h-screen">
      <div className="mb-8 p-4 rounded-lg bg-primary">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>
      
      <FinancialSummary data={data} />

      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FundAllocationChart data={bankData} />
          <ProjectedSavingsChart 
            initialBalance={data.totalBalance}
            annualYieldRate={data.averageYield}
          />
        </div>
        
        <BankAccountList />
      </div>

      {/* Floating Add Account Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      <AddBankAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
