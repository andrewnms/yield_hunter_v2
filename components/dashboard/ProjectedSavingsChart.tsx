'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface ProjectionData {
  day: number;
  balance: number;
}

interface ProjectedSavingsChartProps {
  initialBalance: number;
  annualYieldRate: number;
  loading?: boolean;
}

const PERIOD_OPTIONS = [
  { label: '30 Days', value: 30 },
  { label: '60 Days', value: 60 },
  { label: '90 Days', value: 90 },
];

const ProjectedSavingsChart = ({
  initialBalance,
  annualYieldRate,
  loading = false,
}: ProjectedSavingsChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const projectionData = useMemo(() => {
    const dailyRate = annualYieldRate / 365 / 100;
    const data: ProjectionData[] = [];

    for (let day = 0; day <= selectedPeriod; day += 5) {
      const balance = initialBalance * Math.pow(1 + dailyRate, day);
      data.push({
        day,
        balance: Math.round(balance * 100) / 100,
      });
    }

    // Always include the final day if it's not already included
    if (data[data.length - 1].day !== selectedPeriod) {
      const finalBalance = initialBalance * Math.pow(1 + dailyRate, selectedPeriod);
      data.push({
        day: selectedPeriod,
        balance: Math.round(finalBalance * 100) / 100,
      });
    }

    return data;
  }, [initialBalance, annualYieldRate, selectedPeriod]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-black">Day {label}</p>
          <p className="text-sm text-gray-600">
            Balance: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-primary">
            Growth: {((payload[0].value / initialBalance - 1) * 100).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-[300px] bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-black font-medium">Projected Balance Growth</h3>
        <div className="flex gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedPeriod(option.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedPeriod === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={projectionData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#EE2B47"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="Projected Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectedSavingsChart;
