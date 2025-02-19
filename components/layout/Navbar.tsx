import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-primary text-secondary p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Yield Hunter
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:text-opacity-80">
            Dashboard
          </Link>
          <Link href="/analytics" className="hover:text-opacity-80">
            Analytics
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
