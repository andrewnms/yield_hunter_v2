import { Suspense } from 'react';
import FinancialSummary from './FinancialSummary';

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
        <Suspense fallback={<div className="text-center text-black">Loading charts...</div>}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
              <h3 className="text-black font-medium mb-4">Yield Rate Trends</h3>
              {/* Yield rate chart will go here */}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
              <h3 className="text-black font-medium mb-4">Balance Distribution</h3>
              {/* Balance distribution chart will go here */}
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
