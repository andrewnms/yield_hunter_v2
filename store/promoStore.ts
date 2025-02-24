import { create } from 'zustand';
import axios from '@/lib/axios';
import type { AxiosError } from 'axios';

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

type CreatePromoInput = Omit<Promo, 'id' | 'createdAt' | 'updatedAt'>;
type UpdatePromoInput = Partial<Omit<Promo, 'id' | 'createdAt' | 'updatedAt'>>;

interface PromoStore {
  promos: Promo[];
  loading: boolean;
  error: string | null;
  fetchPromos: () => Promise<void>;
  createPromo: (promo: CreatePromoInput) => Promise<void>;
  updatePromo: (id: string, promo: UpdatePromoInput) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
}

const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return axiosError.response?.data?.error || axiosError.message;
    }
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const usePromoStore = create<PromoStore>((set) => ({
  promos: [],
  loading: false,
  error: null,

  fetchPromos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  createPromo: async (promo) => {
    set({ loading: true, error: null });
    try {
      await axios.post('/api/admin/promos', { promo });
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  updatePromo: async (id, promo) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/api/admin/promos/${id}`, { promo });
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  deletePromo: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/admin/promos/${id}`);
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
}));
