'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface BankData {
  name: string;
  balance: number;
}

interface FundAllocationChartProps {
  data: BankData[];
  loading?: boolean;
}

// Predefined colors for the pie chart segments
const COLORS = ['#EE2B47', '#FF9F1C', '#2EC4B6', '#5C4B77', '#8D6A9F'];

const FundAllocationChart = ({ data, loading = false }: FundAllocationChartProps) => {
  const chartData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.balance, 0);
    return data.map(item => ({
      name: item.name,
      value: item.balance,
      percentage: ((item.balance / total) * 100).toFixed(1)
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="flex justify-center items-center h-[300px]">
          <div className="w-48 h-48 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-black">{data.name}</p>
          <p className="text-sm text-gray-600">
            Balance: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            Allocation: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
      <h3 className="text-black font-medium mb-4">Fund Distribution</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            align="right"
            verticalAlign="middle"
            formatter={(value, entry: any) => (
              <span className="text-sm text-black">
                {value} ({entry.payload.percentage}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundAllocationChart;
