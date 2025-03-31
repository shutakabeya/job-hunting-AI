'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CompanyData } from '@/types';

interface CompanyGridProps {
  companies: Array<CompanyData & { matchScore: number; matchReason: string }>;
  displayedCount: number;
  showMoreButton: boolean;
  onShowMore: () => void;
}

export function CompanyGrid({ companies, displayedCount, showMoreButton, onShowMore }: CompanyGridProps) {
  const router = useRouter();
  const displayedCompanies = companies.slice(0, displayedCount);

  console.log('CompanyGrid received companies:', companies); // デバッグ用
  console.log('Displayed companies:', displayedCompanies); // デバッグ用
  console.log('Displayed count:', displayedCount); // デバッグ用
  console.log('Show more button:', showMoreButton); // デバッグ用

  const handleCompanyClick = (companyId: string) => {
    router.push(`/companies/${companyId}`);
  };

  if (!companies || companies.length === 0) {
    console.log('No companies to display'); // デバッグ用
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">表示する企業がありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedCompanies.map((company, index) => {
          console.log('Rendering company:', company); // デバッグ用
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border p-6 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCompanyClick(company.id)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-semibold">{company.name || '企業名なし'}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      マッチング度 {Math.round((company.matchScore || 0) * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{company.description || '説明なし'}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">あなたに合う理由</h4>
                <p className="mt-2 text-sm text-gray-600">{company.matchReason || 'マッチング理由なし'}</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompanyClick(company.id);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  選考準備を始める
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showMoreButton && (
        <div className="flex justify-center mt-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowMore();
            }}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
          >
            もっと見る
          </button>
        </div>
      )}
    </div>
  );
} 