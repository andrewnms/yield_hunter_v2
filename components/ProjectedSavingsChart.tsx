'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ProjectionData {
  current_balance: number;
  projected_balance: number;
  yield_rate: number;
  days: number;
  annual_earnings: number;
  projection_date: string;
}

interface Props {
  bankAccountId: string;
  onError?: (error: Error) => void;
}

export default function ProjectedSavingsChart({ bankAccountId, onError }: Props) {
  const [projectionData, setProjectionData] = useState<ProjectionData | null>(null);
  const [timeframe, setTimeframe] = useState(40); // default 40 days
  const [loading, setLoading] = useState(false);

  const fetchProjection = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/bank_accounts/${bankAccountId}/projection?days=${timeframe}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch projection data');
      }

      const data = await response.json();
      setProjectionData(data);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjection();
  }, [bankAccountId, timeframe]);

  if (loading) {
    return <div>Loading projection data...</div>;
  }

  if (!projectionData) {
    return <div>No projection data available</div>;
  }

  const chartData = [
    {
      date: 'Current',
      balance: projectionData.current_balance,
    },
    {
      date: new Date(projectionData.projection_date).toLocaleDateString(),
      balance: projectionData.projected_balance,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projected Savings Growth</h2>
        <div className="space-x-2">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframe(days)}
              className={`px-3 py-1 rounded ${
                timeframe === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                }).format(Number(value))
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-gray-600">Current Balance</p>
          <p className="text-xl font-semibold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(projectionData.current_balance)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-gray-600">Projected Balance</p>
          <p className="text-xl font-semibold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(projectionData.projected_balance)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-gray-600">Annual Earnings</p>
          <p className="text-xl font-semibold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(projectionData.annual_earnings)}
          </p>
        </div>
      </div>
    </div>
  );
}
