import axios from 'axios';
import { create } from 'zustand';

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

export type CreatePromoInput = Omit<Promo, 'id' | 'createdAt' | 'updatedAt'>;

interface PromoState {
  promos: Promo[];
  loading: boolean;
  error: string | null;
  fetchPromos: () => Promise<void>;
  createPromo: (promo: CreatePromoInput) => Promise<void>;
  updatePromo: (id: string, promo: Partial<Promo>) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
}

export const createPromo = async (promoData: CreatePromoInput): Promise<Promo> => {
  try {
    console.log('Creating promo with data:', promoData);
    
    // Validate required fields
    if (!promoData.validUntil) {
      throw new Error('Valid until date is required');
    }
    if (!promoData.title) {
      throw new Error('Title is required');
    }
    if (!promoData.description) {
      throw new Error('Description is required');
    }
    if (!promoData.bank) {
      throw new Error('Bank is required');
    }

    // Format the request payload
    const payload = {
      promo: {
        title: promoData.title,
        description: promoData.description,
        bank: promoData.bank,
        promo_type: promoData.promoType || 'info',
        valid_until: promoData.validUntil,
        cta_text: promoData.ctaText || '',
        cta_url: promoData.ctaUrl || '',
        active: promoData.active ?? true
      }
    };

    console.log('Sending API request with payload:', payload);
    
    const response = await axios.post<Promo>(
      '/api/admin/promos',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.data) {
      throw new Error('No data received from API');
    }

    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating promo:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const usePromoStore = create<PromoState>((set) => ({
  promos: [],
  loading: false,
  error: null,

  fetchPromos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Promo[]>('/api/admin/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching promos:', error);
      set({ error: 'Failed to fetch promos', loading: false });
    }
  },

  createPromo: async (promo: CreatePromoInput) => {
    set({ loading: true, error: null });
    try {
      const createdPromo = await createPromo(promo);
      set((state) => ({
        promos: [createdPromo, ...state.promos],
        loading: false
      }));
    } catch (error) {
      console.error('Error creating promo:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create promo',
        loading: false 
      });
      throw error; // Re-throw to handle in the component
    }
  },

  updatePromo: async (id: string, promo: Partial<Promo>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put<Promo>(`/api/admin/promos/${id}`, { promo });
      set((state) => ({
        promos: state.promos.map((p) => (p.id === id ? response.data : p)),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating promo:', error);
      set({ error: 'Failed to update promo', loading: false });
      throw error;
    }
  },

  deletePromo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/admin/promos/${id}`);
      set((state) => ({
        promos: state.promos.filter((p) => p.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting promo:', error);
      set({ error: 'Failed to delete promo', loading: false });
      throw error;
    }
  }
}));
