import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from './components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-600">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/">
            <Home className="size-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
