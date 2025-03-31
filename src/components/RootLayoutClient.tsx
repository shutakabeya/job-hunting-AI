'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('./Sidebar'), {
  ssr: false,
  loading: () => <div className="w-64 bg-white border-r border-gray-200" />
});

interface RootLayoutClientProps {
  children: React.ReactNode;
  className?: string;
}

export default function RootLayoutClient({ children, className }: RootLayoutClientProps) {
  return (
    <div className="flex h-screen bg-white">
      <Suspense fallback={<div className="w-64 bg-white border-r border-gray-200" />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 bg-white">
        {children}
      </main>
    </div>
  );
} 