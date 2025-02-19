'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useBankAccountStore } from '@/store/bankAccountStore';

const COLORS = ['#EE2B47', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};

export default function FundAllocationChart() {
  const bankAccounts = useBankAccountStore((state) => state.accounts) || [];

  // Memoize the chart data to prevent unnecessary recalculations
  const { chartData, totalBalance } = useMemo(() => {
    if (!bankAccounts || bankAccounts.length === 0) {
      return {
        chartData: [],
        totalBalance: 0,
      };
    }

    const total = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
    
    const data = bankAccounts.map((account, index) => ({
      name: account.name,
      value: account.balance,
      percentage: ((account.balance / total) * 100).toFixed(1),
      color: COLORS[index % COLORS.length],
    }));

    return {
      chartData: data,
      totalBalance: total,
    };
  }, [bankAccounts]);

  // Memoize the custom tooltip to prevent recreation on every render
  const CustomTooltip = useMemo(() => {
    return ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
            <p className="font-medium text-black">{data.name}</p>
            <p className="text-gray-600">
              Balance:{' '}
              <span className="font-medium text-black">
                {formatCurrency(data.value)}
              </span>
            </p>
            <p className="text-gray-600">
              Percentage:{' '}
              <span className="font-medium text-black">{data.percentage}%</span>
            </p>
          </div>
        );
      }
      return null;
    };
  }, []);

  // Memoize the custom legend to prevent recreation on every render
  const CustomLegend = useMemo(() => {
    return ({ payload }: any) => {
      if (!payload) return null;
      
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {payload.map((entry: any, index: number) => {
            const item = entry.payload;
            return (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name} ({item.percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      );
    };
  }, []);

  if (!bankAccounts || bankAccounts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2 text-black">Fund Allocation</h2>
        <p className="text-gray-500 text-center">
          Add bank accounts to see your fund allocation
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Fund Allocation</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
            <Legend 
              content={CustomLegend}
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Total Balance:{' '}
          <span className="font-medium text-black">
            {formatCurrency(totalBalance)}
          </span>
        </p>
      </div>
    </div>
  );
}
