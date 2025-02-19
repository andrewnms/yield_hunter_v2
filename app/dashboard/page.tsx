'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
}
