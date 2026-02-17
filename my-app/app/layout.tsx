import type { Metadata } from 'next';
import { AppLayout } from './components/AppLayout';
import '../styles/index.css';

export const metadata: Metadata = {
  title: 'DB Migrate - Database Migration Tool',
  description: 'Manage database migrations with Prisma and Flyway',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}