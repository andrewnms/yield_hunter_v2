'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { usePromoStore } from '@/store/promoStore';

// Define the structure of a promo
interface Promo {
  id: string;
  title: string;
  description: string;
  bank: string;
  type: 'info' | 'success' | 'warning';
  validUntil: Date;
  ctaText?: string;
  ctaUrl?: string;
}

export default function PromoAlerts() {
  const { promos, loading, error, fetchPromos } = usePromoStore();
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  // Auto-rotate promos every 5 seconds
  useEffect(() => {
    if (promos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPromoIndex((current) => (current + 1) % promos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promos.length]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:shadow-xl mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (error || promos.length === 0) return null;

  const currentPromo = promos[currentPromoIndex];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:shadow-xl mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#134B42] font-medium">Latest Promotions</h3>
        {promos.length > 1 && (
          <div className="flex space-x-2">
            <button
              type="button"
              className="rounded-md p-1.5 text-[#134B42] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => setCurrentPromoIndex((current) => 
                current === 0 ? promos.length - 1 : current - 1
              )}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-[#134B42] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => setCurrentPromoIndex((current) => 
                (current + 1) % promos.length
              )}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xl font-semibold text-[#134B42]">
            {currentPromo.title}
          </h4>
          <p className="mt-2 text-gray-600">
            {currentPromo.description}
          </p>
        </div>

        {(currentPromo.ctaText && currentPromo.ctaUrl) && (
          <div>
            <a
              href={currentPromo.ctaUrl}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#CA763A] hover:bg-[#B56833] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CA763A]"
            >
              {currentPromo.ctaText}
            </a>
          </div>
        )}
      </div>
      
      {/* Progress indicators */}
      {promos.length > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          {promos.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentPromoIndex 
                  ? 'w-4 bg-[#CA763A] opacity-80' 
                  : 'w-1.5 bg-[#CA763A] opacity-40'
              }`}
              onClick={() => setCurrentPromoIndex(index)}
            >
              <span className="sr-only">Promo {index + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
