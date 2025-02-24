'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface YieldRate {
  id: string;
  bankName: string;
  accountType: string;
  rate: number;
  lastUpdated: Date;
}

export default function YieldRateManager() {
  const { user } = useAuth();
  const [yieldRates, setYieldRates] = useState<YieldRate[]>([]);
  const [newRate, setNewRate] = useState({
    bankName: '',
    accountType: '',
    rate: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchYieldRates();
  }, []);

  const fetchYieldRates = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/yield-rates', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setYieldRates(data);
      } else {
        setError('Failed to fetch yield rates');
      }
    } catch (error) {
      setError('Error fetching yield rates');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/yield-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newRate),
      });

      if (response.ok) {
        setNewRate({
          bankName: '',
          accountType: '',
          rate: 0,
        });
        fetchYieldRates();
      } else {
        setError('Failed to add yield rate');
      }
    } catch (error) {
      setError('Error adding yield rate');
    }
  };

  if (!user?.isAdmin) {
    return <div className="p-4">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Yield Rate Manager</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">Bank Name</label>
          <input
            type="text"
            value={newRate.bankName}
            onChange={(e) => setNewRate({ ...newRate, bankName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Account Type</label>
          <input
            type="text"
            value={newRate.accountType}
            onChange={(e) => setNewRate({ ...newRate, accountType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={newRate.rate}
            onChange={(e) => setNewRate({ ...newRate, rate: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Yield Rate
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Bank Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Account Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Rate (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {yieldRates.map((rate) => (
              <tr key={rate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-black">{rate.bankName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black">{rate.accountType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-black">{rate.rate.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {new Date(rate.lastUpdated).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
