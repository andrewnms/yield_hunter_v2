/**
 * Represents a bank category and its associated banks
 */
interface BankCategory {
  name: string;
  banks: string[];
}

/**
 * Comprehensive list of Philippine banks organized by category
 * Used for dropdown selections in bank-related components
 */
export const BANK_CATEGORIES: BankCategory[] = [
  {
    name: 'Fully Licensed Digital Banks',
    banks: [
      'Maya Bank, Inc.',
      'UnionDigital Bank',
      'GoTyme Bank',
      'Tonik Digital Bank, Inc.',
      'UNOBank, Inc.',
      'Overseas Filipino Bank, Inc.',
    ]
  },
  {
    name: 'Digital Banks with Fintech Partnerships',
    banks: [
      'CIMB Bank Philippines',
      'SeaBank Philippines, Inc.',
    ]
  },
  {
    name: 'E-Wallets with Digital Banking Features',
    banks: [
      'GCash',
      'Maya',
      'ShopeePay',
      'Coins.ph',
    ]
  },
  {
    name: 'Traditional Banks with Digital Banking Platforms',
    banks: [
      'BPI Online / BPI Mobile',
      'RCBC DiskarTech',
      'Metrobank Online',
      'PNB Digital Banking',
    ]
  }
];

/**
 * Flattened list of all banks for simple dropdown usage
 */
export const ALL_BANKS = BANK_CATEGORIES.reduce<string[]>(
  (acc, category) => [...acc, ...category.banks],
  []
);
