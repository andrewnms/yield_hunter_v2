'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_BANKS, BANK_CATEGORIES } from '@/constants/banks';

interface YieldRate {
  _id: string;
  bank_name: string;
  rate: number;
  last_updated: string;
}

/**
 * Component for managing yield rates in the admin panel
 * Allows admins to view, add, and manage yield rates for different banks
 */
export default function YieldRateManager() {
  const { user } = useAuth();
  const [yieldRates, setYieldRates] = useState<YieldRate[]>([]);
  const [selectedBank, setSelectedBank] = useState(BANK_CATEGORIES[0].banks[0]);
  const [rate, setRate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchYieldRates();
  }, []);

  /**
   * Fetches current yield rates from the backend
   */
  const fetchYieldRates = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/yield_rates', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch yield rates');
      }
      
      const data = await response.json();
      setYieldRates(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load yield rates');
      console.error(err);
    }
  };

  /**
   * Handles the submission of a new yield rate
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedBank || !rate) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/admin/yield_rates', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          yield_rate: {
            bank_name: selectedBank,
            rate: parseFloat(rate),
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create yield rate');
      }

      await fetchYieldRates();
      setSuccess('Yield rate added successfully');
      setRate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create yield rate');
      console.error(err);
    }
  };

  if (!user?.isAdmin) {
    return <div className="p-4">Access denied. Admin only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-black">Manage Yield Rates</h2>

        <form onSubmit={handleSubmit} className="space-y-6 mb-10">
          <div className="space-y-2">
            <label htmlFor="bank" className="block text-base font-medium text-gray-700">
              Bank
            </label>
            <select
              id="bank"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="mt-2 block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black shadow-sm"
            >
              {BANK_CATEGORIES.map((category) => (
                <optgroup key={category.name} label={category.name} className="text-black">
                  {category.banks.map((bank) => (
                    <option key={bank} value={bank} className="text-black">
                      {bank}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="rate" className="block text-base font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              id="rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              step="0.01"
              min="0"
              max="100"
              className="mt-2 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black text-lg"
              placeholder="e.g., 4.5"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6"
          >
            Add Yield Rate
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-md text-base">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 text-green-700 bg-green-100 rounded-md text-base">
            {success}
          </div>
        )}

        <div className="mt-10">
          <h3 className="text-2xl font-medium text-black mb-6">Current Yield Rates</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Rate (%)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yieldRates.map((rate) => (
                  <tr key={rate._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                      {rate.bank_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                      {rate.rate.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                      {new Date(rate.last_updated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
