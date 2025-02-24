import { create } from 'zustand';

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  yieldRate: number;
  createdAt: string;
  updatedAt: string;
}

interface BankAccountStore {
  accounts: BankAccount[];
  isLoading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  addAccount: (account: Omit<BankAccount, 'id' | 'yieldRate' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Omit<BankAccount, 'id' | 'yieldRate' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useBankAccountStore = create<BankAccountStore>((set, get) => ({
  accounts: [],
  isLoading: false,
  error: null,

  fetchAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/bank_accounts?_=${Date.now()}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Map the snake_case from backend to camelCase for frontend
      const accounts = data.map((account: any) => ({
        id: account._id,
        name: account.name,
        bankName: account.bank_name,
        balance: Number(account.balance) || 0,
        yieldRate: Number(account.yield_rate) || 0,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }));
      
      set({ accounts, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch accounts', isLoading: false });
    }
  },

  addAccount: async (account) => {
    set({ isLoading: true, error: null });
    try {
      // Convert camelCase to snake_case for the backend
      const backendAccount = {
        name: account.name,
        bank_name: account.bankName,
        balance: account.balance,
      };

      const response = await fetch(`${API_BASE_URL}/bank_accounts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(backendAccount),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Map the snake_case from backend to camelCase for frontend
      const newAccount = {
        id: data._id,
        name: data.name,
        bankName: data.bank_name,
        balance: Number(data.balance) || 0,
        yieldRate: Number(data.yield_rate) || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      const { accounts } = get();
      set({ accounts: [...accounts, newAccount], isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add account', isLoading: false });
    }
  },

  updateAccount: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Convert camelCase to snake_case for the backend
      const backendUpdates = {
        ...(updates.name && { name: updates.name }),
        ...(updates.bankName && { bank_name: updates.bankName }),
        ...(updates.balance !== undefined && { balance: updates.balance }),
      };

      const response = await fetch(`${API_BASE_URL}/bank_accounts/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(backendUpdates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Map the snake_case from backend to camelCase for frontend
      const updatedAccount = {
        id: data._id,
        name: data.name,
        bankName: data.bank_name,
        balance: Number(data.balance) || 0,
        yieldRate: Number(data.yield_rate) || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      const { accounts } = get();
      set({
        accounts: accounts.map(account => 
          account.id === id ? updatedAccount : account
        ),
        isLoading: false
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update account', isLoading: false });
    }
  },

  deleteAccount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/bank_accounts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { accounts } = get();
      set({
        accounts: accounts.filter(account => account.id !== id),
        isLoading: false
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete account', isLoading: false });
    }
  },
}));
