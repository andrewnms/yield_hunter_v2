'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useBankAccountStore } from '@/store/bankAccountStore';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const BANK_OPTIONS = [
  // Fully Licensed Digital Banks
  { id: 1, name: 'Maya Bank, Inc.', category: 'Fully Licensed Digital Banks' },
  { id: 2, name: 'UnionDigital Bank', category: 'Fully Licensed Digital Banks' },
  { id: 3, name: 'GoTyme Bank', category: 'Fully Licensed Digital Banks' },
  { id: 4, name: 'Tonik Digital Bank, Inc.', category: 'Fully Licensed Digital Banks' },
  { id: 5, name: 'UNOBank, Inc.', category: 'Fully Licensed Digital Banks' },
  { id: 6, name: 'Overseas Filipino Bank, Inc.', category: 'Fully Licensed Digital Banks' },
  
  // Digital Banks with Fintech Partnerships
  { id: 7, name: 'CIMB Bank Philippines', category: 'Digital Banks with Fintech Partnerships' },
  { id: 8, name: 'SeaBank Philippines, Inc.', category: 'Digital Banks with Fintech Partnerships' },
  
  // E-Wallets with Digital Banking Features
  { id: 9, name: 'GCash', category: 'E-Wallets with Digital Banking Features' },
  { id: 10, name: 'Maya', category: 'E-Wallets with Digital Banking Features' },
  { id: 11, name: 'ShopeePay', category: 'E-Wallets with Digital Banking Features' },
  { id: 12, name: 'Coins.ph', category: 'E-Wallets with Digital Banking Features' },
  
  // Traditional Banks with Digital Banking Platforms
  { id: 13, name: 'BPI Online', category: 'Traditional Banks with Digital Banking Platforms' },
  { id: 14, name: 'RCBC DiskarTech', category: 'Traditional Banks with Digital Banking Platforms' },
  { id: 15, name: 'Metrobank Online', category: 'Traditional Banks with Digital Banking Platforms' },
  { id: 16, name: 'PNB Digital Banking', category: 'Traditional Banks with Digital Banking Platforms' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBankAccountModal({ isOpen, onClose }: Props) {
  const { addAccount, isLoading, error } = useBankAccountStore();
  const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0]);
  const [balance, setBalance] = useState('');
  const [yieldRate, setYieldRate] = useState('4.50');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const parsedYieldRate = parseFloat(yieldRate);
    if (parsedYieldRate <= 0) {
      setSubmitError('Yield rate must be greater than 0%');
      return;
    }

    try {
      await addAccount({
        name: selectedBank.name,
        balance: parseFloat(balance),
        yieldRate: parsedYieldRate
      });
      
      // Reset form and close modal on success
      setSelectedBank(BANK_OPTIONS[0]);
      setBalance('');
      setYieldRate('4.50');
      onClose();
    } catch (error) {
      setSubmitError((error as Error).message);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Bank Account
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <Listbox value={selectedBank} onChange={setSelectedBank}>
                      <div className="relative mt-1">
                        <Listbox.Label className="block text-sm font-medium text-gray-700">
                          Select Bank
                        </Listbox.Label>
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 text-base text-black">
                          <span className="block truncate">{selectedBank.name}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {Object.entries(
                              BANK_OPTIONS.reduce((acc, bank) => {
                                if (!acc[bank.category]) {
                                  acc[bank.category] = [];
                                }
                                acc[bank.category].push(bank);
                                return acc;
                              }, {} as Record<string, typeof BANK_OPTIONS>)
                            ).map(([category, banks]) => (
                              <div key={category}>
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                  {category}
                                </div>
                                {banks.map((bank) => (
                                  <Listbox.Option
                                    key={bank.id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-blue-100 text-blue-900' : 'text-black'
                                      }`
                                    }
                                    value={bank}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected ? 'font-medium' : 'font-normal'
                                          }`}
                                        >
                                          {bank.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </div>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <div>
                    <label
                      htmlFor="balance"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Initial Balance
                    </label>
                    <input
                      type="number"
                      id="balance"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-base py-3 px-4"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="yieldRate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Yield Rate (%)
                    </label>
                    <input
                      type="number"
                      id="yieldRate"
                      value={yieldRate}
                      onChange={(e) => setYieldRate(e.target.value)}
                      step="0.01"
                      min="0.01"
                      placeholder="Enter yield rate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-base py-3 px-4"
                      required
                    />
                  </div>

                  {(error || submitError) && (
                    <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
                      {error || submitError}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Adding...' : 'Add Account'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
