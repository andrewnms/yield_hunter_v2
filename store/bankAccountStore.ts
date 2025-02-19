import { create } from 'zustand';

export interface BankAccount {
  id: number;
  name: string;
  balance: number;
  yieldRate: number;
}

interface BankAccountStore {
  accounts: BankAccount[];
  addAccount: (account: Omit<BankAccount, 'id'>) => void;
  updateAccount: (id: number, updates: Partial<BankAccount>) => void;
  deleteAccount: (id: number) => void;
}

// Initial dummy data
const initialAccounts: BankAccount[] = [
  { id: 1, name: "Maya Bank", balance: 5000, yieldRate: 2.5 },
  { id: 2, name: "UnionDigital", balance: 3000, yieldRate: 3.0 },
  { id: 3, name: "GCash (CIMB)", balance: 7000, yieldRate: 2.8 },
];

export const useBankAccountStore = create<BankAccountStore>((set) => ({
  accounts: initialAccounts,
  addAccount: (account) =>
    set((state) => ({
      accounts: [
        ...state.accounts,
        { ...account, id: Math.max(...state.accounts.map(a => a.id), 0) + 1 },
      ],
    })),
  updateAccount: (id, updates) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === id ? { ...account, ...updates } : account
      ),
    })),
  deleteAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((account) => account.id !== id),
    })),
}));
