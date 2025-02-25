'use client';

import { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import PromoManager from '@/components/admin/PromoManager';

export default function PromoManagementPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Promo Management</h1>
        <Button onClick={() => setIsOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Promo
        </Button>
      </div>

      <PromoManager 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
      />
    </div>
  );
}
