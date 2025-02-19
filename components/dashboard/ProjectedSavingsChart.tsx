'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProjectedSavingsChartProps {
  initialBalance: number;
  annualYieldRate: number;
}

export default function ProjectedSavingsChart({
  initialBalance,
  annualYieldRate,
}: ProjectedSavingsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(90);
  const periods = [30, 60, 90];

  const data = useMemo(() => {
    const dailyRate = annualYieldRate / 365 / 100;
    return Array.from({ length: selectedPeriod + 1 }, (_, day) => ({
      day,
      balance: initialBalance * Math.pow(1 + dailyRate, day),
    }));
  }, [initialBalance, annualYieldRate, selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-black">
          Projected Balance Growth
        </h3>
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {period} Days
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              tickCount={6}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
              label={{
                value: 'Days',
                position: 'insideBottom',
                offset: -15,
                fontSize: 12,
              }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12 }}
              width={90}
              label={{
                value: 'Balance',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
                fontSize: 12,
              }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Projected Balance']}
              labelFormatter={(value) => `Day ${value}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                padding: '0.5rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#EE2B47"
              strokeWidth={2}
              dot={false}
              name="Projected Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
