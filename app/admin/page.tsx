'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import YieldRateManager from '@/components/admin/YieldRateManager';
import PromoManagement from '@/components/admin/PromoManagement';

/**
 * Navigation bar component for the admin dashboard
 * Displays the admin header, user email, and navigation buttons
 */
interface AdminNavbarProps {
  userEmail: string;
  onDashboard: () => void;
  onLogout: () => void;
}

function AdminNavbar({ userEmail, onDashboard, onLogout }: AdminNavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-black">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Logged in as {userEmail}</span>
            <button
              onClick={onDashboard}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              aria-label="Return to dashboard"
            >
              Back to Dashboard
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              aria-label="Sign out of admin panel"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Loading spinner component shown while checking authentication
 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

type AdminTab = 'yield-rates' | 'promos';

/**
 * Admin page component that provides an interface for managing yield rates and promos
 * Only accessible to users with admin privileges
 * 
 * Features:
 * - Protected route (redirects non-admin users)
 * - Yield rate management interface
 * - Promo management interface
 * - Tab navigation between different admin features
 * - Navigation to main dashboard
 * - Secure logout functionality
 */
export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('yield-rates');

  // Redirect non-admin users to home page
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, loading, router]);

  /**
   * Handles user logout and redirects to login page
   * Ensures proper cleanup of auth state before navigation
   */
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      // Could add error handling UI here if needed
    }
  };

  /**
   * Navigates user back to the main dashboard
   */
  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user?.isAdmin) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar
        userEmail={user.email}
        onDashboard={handleBackToDashboard}
        onLogout={handleLogout}
      />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('yield-rates')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'yield-rates'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Yield Rates
              </button>
              <button
                onClick={() => setActiveTab('promos')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'promos'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Promotions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'yield-rates' && <YieldRateManager />}
            {activeTab === 'promos' && <PromoManagement />}
          </div>
        </div>
      </main>
    </div>
  );
}
