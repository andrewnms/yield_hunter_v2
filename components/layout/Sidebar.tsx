import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg">
      <div className="p-4">
        <nav className="space-y-2">
          <Link 
            href="/dashboard"
            className="block p-2 rounded hover:bg-secondary hover:text-primary transition-colors"
          >
            Overview
          </Link>
          <Link 
            href="/yields"
            className="block p-2 rounded hover:bg-secondary hover:text-primary transition-colors"
          >
            Yield Rates
          </Link>
          <Link 
            href="/accounts"
            className="block p-2 rounded hover:bg-secondary hover:text-primary transition-colors"
          >
            Accounts
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
