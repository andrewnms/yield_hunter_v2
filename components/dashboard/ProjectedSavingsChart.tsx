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
  ReferenceLine,
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
  const periods = [
    { days: 30, label: '30 Days' },
    { days: 90, label: '90 Days' },
    { days: 365, label: '1 Year' }
  ];

  const { data, domain } = useMemo(() => {
    const dailyRate = annualYieldRate / 365 / 100;
    const currentDate = new Date();
    
    // Adjust sampling interval based on selected period
    const getSampleInterval = (period: number) => {
      if (period <= 30) return 5;      // 5 days for 30-day view
      if (period <= 90) return 10;     // 10 days for 90-day view
      return 30;                       // 30 days (monthly) for yearly view
    };
    
    const SAMPLE_INTERVAL = getSampleInterval(selectedPeriod);
    
    // Always start 30 days before current date
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 30);

    // Calculate total days needed (30 days before + selected period)
    const totalDays = 30 + selectedPeriod;
    const numPoints = Math.ceil(totalDays / SAMPLE_INTERVAL);

    const chartData = Array.from({ length: numPoints + 1 }, (_, index) => {
      const daysOffset = index * SAMPLE_INTERVAL;
      const date = new Date(startDate);
      date.setDate(date.getDate() + daysOffset);
      
      // Calculate days from present for balance calculation
      const daysFromPresent = Math.floor((date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const balance = initialBalance * Math.pow(1 + dailyRate, daysFromPresent);

      return {
        date,
        balance,
      };
    });

    // Calculate average balance
    const avgBalance = chartData.reduce((sum, point) => sum + point.balance, 0) / chartData.length;
    
    // Set bounds to be 25% above and below average
    const margin = avgBalance * 0.25;
    const upperBound = avgBalance + margin;
    const lowerBound = Math.max(0, avgBalance - margin); // Don't go below 0

    return {
      data: chartData,
      domain: [lowerBound, upperBound]
    };
  }, [initialBalance, annualYieldRate, selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-black font-heading">
          Projected Balance Growth
        </h3>
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period.days}
              onClick={() => setSelectedPeriod(period.days)}
              className={`px-3 py-1 text-sm rounded-full transition-colors font-heading ${
                selectedPeriod === period.days
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {period.label}
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
              dataKey="date"
              tickCount={6}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatDate(new Date(value))}
              label={{
                value: 'Date',
                position: 'insideBottom',
                offset: -15,
                fontSize: 12,
              }}
            />
            <YAxis
              domain={domain}
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
              labelFormatter={(value) => formatDate(new Date(value))}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
              }}
            />
            <ReferenceLine x={new Date().toISOString()} stroke="#718096" strokeDasharray="3 3" label={{ value: 'Today', position: 'top' }} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#EE2B47"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#EE2B47' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
