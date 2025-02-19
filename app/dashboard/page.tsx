import Dashboard from '@/components/dashboard/Dashboard';

// This would normally come from an API call
const dummyData = {
  totalBalance: 125000.00,
  projectedBalance: 126562.50,
  averageYield: 5.25,
  highestYield: {
    bank: 'Digital Bank A',
    rate: 7.50,
  },
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-secondary">
      <Dashboard data={dummyData} />
    </main>
  );
}
