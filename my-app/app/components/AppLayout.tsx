'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, GitBranch, FileUp, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Database },
    { path: '/prisma-migration', label: 'Prisma Migration', icon: GitBranch },
    { path: '/flyway-migration', label: 'Flyway Migration', icon: FileUp },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="size-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">DB Migrate</h1>
              <p className="text-xs text-gray-500">Migration Tool</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Version 1.0.0</p>
            <p>© 2026 DB Migrate</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Database className="size-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">DB Migrate</span>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="size-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">DB Migrate</h1>
                  <p className="text-xs text-gray-500">Migration Tool</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}
