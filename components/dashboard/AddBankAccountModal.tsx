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
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!balance || parseFloat(balance) <= 0) {
      setSubmitError('Please enter a valid balance');
      return;
    }

    try {
      await addAccount({
        name: selectedBank.name,
        bankName: selectedBank.name,
        balance: parseFloat(balance),
      });
      
      // Reset form and close modal on success
      setSelectedBank(BANK_OPTIONS[0]);
      setBalance('');
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

                <form onSubmit={handleSubmit} className="mt-4">
                  {submitError && (
                    <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Bank
                      </label>
                      <Listbox value={selectedBank} onChange={setSelectedBank}>
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                              {BANK_OPTIONS.map((bank, bankIdx) => (
                                <Listbox.Option
                                  key={bank.id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
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
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>

                    <div>
                      <label
                        htmlFor="balance"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Initial Balance
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="balance"
                          id="balance"
                          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          value={balance}
                          onChange={(e) => setBalance(e.target.value)}
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
