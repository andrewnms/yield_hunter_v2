'use client';

import { ReactNode } from 'react';

interface FinancialSummaryCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    timeframe?: string;
  };
  icon?: ReactNode;
  loading?: boolean;
}

const FinancialSummaryCard = ({
  title,
  value,
  description,
  trend,
  icon,
  loading = false,
}: FinancialSummaryCardProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02] hover:shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#134B42] font-medium">{title}</h3>
        {icon && <span className="text-[#CA763A]">{icon}</span>}
      </div>
      
      <div className="flex items-baseline space-x-2 mb-1">
        <p className="text-2xl font-bold text-[#134B42]">{value}</p>
        {trend && (
          <span 
            className={`px-2 py-1 rounded-full text-sm flex items-center ${
              trend.isPositive ? 'bg-[#ca763a15] text-[#CA763A]' : 'bg-red-100 text-red-800'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} 
            {Math.abs(trend.value)}%
            {trend.timeframe && <span className="ml-1 text-xs opacity-75">/{trend.timeframe}</span>}
          </span>
        )}
      </div>

      {description && (
        <p className="text-sm text-[#134B42] opacity-75 mt-1">{description}</p>
      )}
    </div>
  );
};

export default FinancialSummaryCard;
