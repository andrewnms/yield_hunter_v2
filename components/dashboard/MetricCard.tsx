import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02] hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-black font-medium">{title}</h3>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold text-black">{value}</p>
        {trend && (
          <span className={`px-2 py-1 rounded-full text-sm ${
            trend.isPositive ? 'bg-primary bg-opacity-10 text-primary' : 'bg-red-100 text-red-800'
          }`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
