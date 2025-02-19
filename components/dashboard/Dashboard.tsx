import { Suspense } from 'react';
import MetricCard from './MetricCard';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

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
      <div className="mb-8 p-4 rounded-lg bg-red-500">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Balance"
          value={formatCurrency(data.totalBalance)}
          trend={{ value: 2.5, isPositive: true }}
        />
        
        <MetricCard
          title="Projected Balance (40 days)"
          value={formatCurrency(data.projectedBalance)}
          trend={{ 
            value: ((data.projectedBalance - data.totalBalance) / data.totalBalance) * 100,
            isPositive: data.projectedBalance > data.totalBalance
          }}
        />
        
        <MetricCard
          title="Average Yield Rate"
          value={formatPercentage(data.averageYield)}
        />
        
        <MetricCard
          title="Highest Yield Bank"
          value={`${data.highestYield.bank}`}
          trend={{ 
            value: data.highestYield.rate,
            isPositive: true
          }}
        />
      </div>

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
