'use client';

import { useState } from 'react';

interface BankAccount {
  _id: string;
  name: string;
  balance: number;
  yield_rate: number;
}

interface Props {
  account: BankAccount;
  onUpdate: (id: string, data: Partial<BankAccount>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function BankAccountCard({ account, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [balance, setBalance] = useState(account.balance.toString());
  const [yieldRate, setYieldRate] = useState(account.yield_rate.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(account._id, {
      balance: parseFloat(balance),
      yield_rate: parseFloat(yieldRate),
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">{account.name}</h3>
        <div className="space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={() => onDelete(account._id)}
            className="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Yield Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={yieldRate}
              onChange={(e) => setYieldRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-600">
            Balance:{' '}
            <span className="font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(account.balance)}
            </span>
          </p>
          <p className="text-gray-600">
            Yield Rate:{' '}
            <span className="font-semibold">{account.yield_rate}%</span>
          </p>
        </div>
      )}
    </div>
  );
}
