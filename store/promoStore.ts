import { create } from 'zustand';
import axios from '@/lib/axios';

export interface Promo {
  id: string;
  title: string;
  description: string;
  bank: string;
  promoType: 'info' | 'success' | 'warning';
  validUntil: string;
  ctaText?: string;
  ctaUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromoStore {
  promos: Promo[];
  loading: boolean;
  error: string | null;
  fetchPromos: () => Promise<void>;
  createPromo: (promo: Partial<Promo>) => Promise<void>;
  updatePromo: (id: string, promo: Partial<Promo>) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
}

export const usePromoStore = create<PromoStore>((set) => ({
  promos: [],
  loading: false,
  error: null,

  fetchPromos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch promos', loading: false });
    }
  },

  createPromo: async (promo) => {
    set({ loading: true, error: null });
    try {
      await axios.post('/api/admin/promos', { promo });
      const response = await axios.get('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to create promo', loading: false });
    }
  },

  updatePromo: async (id, promo) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/api/admin/promos/${id}`, { promo });
      const response = await axios.get('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to update promo', loading: false });
    }
  },

  deletePromo: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/admin/promos/${id}`);
      const response = await axios.get('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to delete promo', loading: false });
    }
  },
}));
