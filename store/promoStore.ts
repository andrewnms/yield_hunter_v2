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

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Configure axios with auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

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
      { headers: getAuthHeaders() }
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
      // Use the public endpoint for fetching promos
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching promos:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch promos',
        loading: false 
      });
    }
  },

  createPromo: async (promo: CreatePromoInput) => {
    set({ loading: true, error: null });
    try {
      await createPromo(promo);
      // Refresh the promos list after creating
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      console.error('Error creating promo:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create promo',
        loading: false
      });
      throw error;
    }
  },

  updatePromo: async (id: string, promo: Partial<Promo>) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/api/admin/promos/${id}`, { promo }, { headers: getAuthHeaders() });
      // Refresh the promos list after updating
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      console.error('Error updating promo:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update promo',
        loading: false
      });
      throw error;
    }
  },

  deletePromo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/admin/promos/${id}`, { headers: getAuthHeaders() });
      // Refresh the promos list after deleting
      const response = await axios.get<Promo[]>('/api/promos');
      set({ promos: response.data, loading: false });
    } catch (error) {
      console.error('Error deleting promo:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to delete promo',
        loading: false
      });
      throw error;
    }
  }
}));
