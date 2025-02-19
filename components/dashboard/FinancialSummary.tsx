'use client';

import { useMemo } from 'react';
import FinancialSummaryCard from './FinancialSummaryCard';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface FinancialData {
  totalBalance: number;
  projectedBalance: number;
  averageYield: number;
  highestYield: {
    bank: string;
    rate: number;
  };
}

interface FinancialSummaryProps {
  data: FinancialData;
  loading?: boolean;
}

const FinancialSummary = ({ data, loading = false }: FinancialSummaryProps) => {
  const projectedGrowth = useMemo(() => {
    if (loading) return 0;
    return ((data.projectedBalance - data.totalBalance) / data.totalBalance) * 100;
  }, [data.projectedBalance, data.totalBalance, loading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <FinancialSummaryCard
        title="Total Balance"
        value={formatCurrency(data.totalBalance)}
        description="Combined balance across all accounts"
        loading={loading}
      />
      
      <FinancialSummaryCard
        title="Projected Balance (40 Days)"
        value={formatCurrency(data.projectedBalance)}
        description="Expected balance based on current yield rates"
        trend={{
          value: Number(projectedGrowth.toFixed(2)),
          isPositive: projectedGrowth > 0,
          timeframe: '40d'
        }}
        loading={loading}
      />
      
      <FinancialSummaryCard
        title="Average Yield Rate"
        value={formatPercentage(data.averageYield)}
        description="Weighted average across all accounts"
        trend={{
          value: data.averageYield,
          isPositive: true
        }}
        loading={loading}
      />
      
      <FinancialSummaryCard
        title="Highest Yield Bank"
        value={data.highestYield.bank}
        description={`Current best rate: ${formatPercentage(data.highestYield.rate)}`}
        trend={{
          value: data.highestYield.rate,
          isPositive: true
        }}
        loading={loading}
      />
    </div>
  );
};

export default FinancialSummary;
