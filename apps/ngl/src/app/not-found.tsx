import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="neu-card p-8 md:p-10">
        <h1 className="text-6xl font-bold text-[#3D4852] mb-4">404</h1>
        <h2 className="text-xl font-semibold text-[#3D4852] mb-2">Page Not Found</h2>
        <p className="text-sm text-[#6B7280] mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="neu-button neu-button-primary inline-flex items-center gap-2 px-6 py-3 font-medium"
        >
          <Home className="w-5 h-5" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}
