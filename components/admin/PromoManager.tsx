'use client';

import { useState, useEffect } from 'react';
import { usePromoStore, type Promo } from '@/store/promoStore';
import { Dialog } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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

export default function PromoManager() {
  const { promos, loading, error, fetchPromos, createPromo, updatePromo, deletePromo } = usePromoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PromoFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updatePromo(editingId, formData);
    } else {
      await createPromo(formData);
    }
    setIsOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleEdit = (promo: Promo) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      bank: promo.bank,
      promoType: promo.promoType,
      validUntil: new Date(promo.validUntil).toISOString().split('T')[0],
      ctaText: promo.ctaText,
      ctaUrl: promo.ctaUrl,
    });
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
              setFormData(initialFormData);
              setEditingId(null);
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

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Edit Promo' : 'Create New Promo'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#CA763A] focus:ring-[#CA763A] text-base py-2 px-3 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#CA763A] focus:ring-[#CA763A] text-base py-2 px-3 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="bank" className="block text-sm font-medium text-gray-900 mb-2">
                  Bank
                </label>
                <input
                  type="text"
                  id="bank"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#CA763A] focus:ring-[#CA763A] text-base py-2 px-3 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="promoType" className="block text-sm font-medium text-gray-900 mb-2">
                  Type
                </label>
                <select
                  id="promoType"
                  value={formData.promoType}
                  onChange={(e) => setFormData({ ...formData, promoType: e.target.value as 'info' | 'success' | 'warning' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#CA763A] focus:ring-[#CA763A] text-base py-2 px-3 text-gray-900"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              <div>
                <label htmlFor="validUntil" className="block text-sm font-medium text-gray-900 mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  id="validUntil"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#CA763A] focus:ring-[#CA763A] text-base py-2 px-3 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="ctaText" className="block text-sm font-medium text-gray-900 mb-2">
                  Call to Action Text (Optional)
                </label>
                <input
                  type="text"
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#CA763A] focus:ring-[#CA763A] text-base py-2 px-3 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-900 mb-2">
                  Call to Action URL (Optional)
                </label>
                <input
                  type="url"
                  id="ctaUrl"
                  value={formData.ctaUrl}
                  onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#CA763A] focus:ring-[#CA763A] text-base py-2 px-3 text-gray-900"
                />
              </div>

              <div className="mt-8 sm:mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#CA763A] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#B56833] focus:outline-none focus:ring-2 focus:ring-[#CA763A] focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                >
                  {editingId ? 'Save Changes' : 'Create Promo'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CA763A] focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
