import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '就活AIエージェント',
  description: 'AIがあなたの就活をサポートします',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-blue-50`}>
        <div className="min-h-screen backdrop-blur-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
