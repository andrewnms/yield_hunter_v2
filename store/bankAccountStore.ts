import { create } from 'zustand';

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountType: string;
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
  addAccount: (account: Omit<BankAccount, 'id'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<BankAccount>) => Promise<void>;
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
      const response = await fetch(`${API_BASE_URL}/bank_accounts`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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
        accountType: account.account_type,
        balance: Number(account.balance) || 0,
        yieldRate: Number(account.yield_rate),
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
        account_type: account.accountType,
        balance: account.balance,
        yield_rate: account.yieldRate
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
        accountType: data.account_type,
        balance: Number(data.balance) || 0,
        yieldRate: Number(data.yield_rate),
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
        ...(updates.accountType && { account_type: updates.accountType }),
        ...(updates.balance !== undefined && { balance: updates.balance }),
        ...(updates.yieldRate !== undefined && { yield_rate: updates.yieldRate })
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
        accountType: data.account_type,
        balance: Number(data.balance) || 0,
        yieldRate: Number(data.yield_rate),
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
