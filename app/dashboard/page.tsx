'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Logout */}
        <div className="sticky top-0 z-50 w-full bg-[#EE2B47] py-8 px-4 md:px-8 shadow-lg border-b border-[#ee2b4730]">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-white">{user?.email}</span>
              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-white text-[#EE2B47] rounded-md hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8">
          <Dashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}
