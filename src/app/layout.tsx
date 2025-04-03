import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';

const RootLayoutClient = dynamic(() => import('@/components/RootLayoutClient'), {
  ssr: false
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '就活支援AI',
  description: 'AIを活用した就職活動支援プラットフォーム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} overflow-hidden bg-white`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
} 