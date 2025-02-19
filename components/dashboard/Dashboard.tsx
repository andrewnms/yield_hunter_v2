'use client';

import { Suspense } from 'react';
import FinancialSummary from './FinancialSummary';
import dynamic from 'next/dynamic';
import BankAccountList from './BankAccountList';

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
  return (
    <div className="p-6">
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
    </div>
  );
};

export default Dashboard;
