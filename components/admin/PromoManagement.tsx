'use client';

import { useState, useEffect } from 'react';
import { usePromoStore } from '@/store/promoStore';
import { motion, AnimatePresence } from 'framer-motion';

interface PromoFormData {
  title: string;
  description: string;
  bank: string;
  promoType: 'info' | 'success' | 'warning';
  validUntil: string;
  ctaText?: string;
  ctaUrl?: string;
  active: boolean;
}

const initialFormData: PromoFormData = {
  title: '',
  description: '',
  bank: '',
  promoType: 'info',
  validUntil: new Date().toISOString().split('T')[0],
  ctaText: '',
  ctaUrl: '',
  active: true,
};

export default function PromoManagement() {
  const { promos, fetchPromos, createPromo, updatePromo, deletePromo, loading, error } = usePromoStore();
  const [formData, setFormData] = useState<PromoFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updatePromo(isEditing, formData);
      } else {
        await createPromo(formData);
      }
      setFormData(initialFormData);
      setIsEditing(null);
      setShowForm(false);
      fetchPromos();
    } catch (err) {
      console.error('Failed to save promo:', err);
    }
  };

  const handleEdit = (promo: any) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      bank: promo.bank,
      promoType: promo.promoType,
      validUntil: new Date(promo.validUntil).toISOString().split('T')[0],
      ctaText: promo.ctaText || '',
      ctaUrl: promo.ctaUrl || '',
      active: promo.active,
    });
    setIsEditing(promo.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo?')) {
      try {
        await deletePromo(id);
        fetchPromos();
      } catch (err) {
        console.error('Failed to delete promo:', err);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading promos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Promo Management</h2>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setIsEditing(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'Add New Promo'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bank</label>
                <input
                  type="text"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="promoType"
                  value={formData.promoType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valid Until</label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA Text (Optional)</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA URL (Optional)</label>
                <input
                  type="url"
                  name="ctaUrl"
                  value={formData.ctaUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                {isEditing ? 'Update' : 'Create'} Promo
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {promos.map((promo) => (
          <motion.div
            key={promo.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{promo.title}</h3>
                <p className="text-sm text-gray-600">{promo.bank}</p>
                <p className="mt-2">{promo.description}</p>
                <div className="mt-2 space-x-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    promo.promoType === 'success' ? 'bg-green-100 text-green-800' :
                    promo.promoType === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {promo.promoType}
                  </span>
                  <span className="text-sm text-gray-600">
                    Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(promo)}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
