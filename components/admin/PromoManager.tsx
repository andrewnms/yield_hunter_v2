'use client';

import { useState, useEffect } from 'react';
import { usePromoStore, type Promo } from '@/store/promoStore';
import PromoManager from './PromoManager';
import { BANK_CATEGORIES } from '@/constants/banks';

interface PromoFormData {
  title: string;
  description: string;
  bank: string;
  promoType: 'info' | 'success' | 'warning';
  validUntil: string;
  ctaText?: string;
  ctaUrl?: string;
}

const initialFormData: PromoFormData = {
  title: '',
  description: '',
  bank: '',
  promoType: 'info',
  validUntil: '',
  ctaText: '',
  ctaUrl: '',
};

export default function PromoManagerPage() {
  const { promos, loading, error, fetchPromos, createPromo, updatePromo, deletePromo } = usePromoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const handleEdit = (promo: Promo) => {
    setEditingId(promo.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this promo?')) {
      await deletePromo(id);
    }
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Promo Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage promotional announcements that will appear on user dashboards.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#CA763A] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#B56833] focus:outline-none focus:ring-2 focus:ring-[#CA763A] focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Promo
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bank</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Valid Until</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {promos.map((promo) => (
                    <tr key={promo.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{promo.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{promo.bank}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{promo.promoType}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(promo.validUntil).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(promo)}
                          className="text-[#134B42] hover:text-[#0D332D] mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PromoManager
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    </div>
  );
}
