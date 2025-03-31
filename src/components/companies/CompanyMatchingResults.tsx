'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { CompanyMatchingEngine } from '@/lib/engines/company-matching-engine';
import { CompanyGrid } from '@/components/CompanyGrid';

interface CompanyMatchingResultsProps {
  companies: Company[];
  onCompanySelect: (company: Company) => void;
  matchingEngine: CompanyMatchingEngine;
}

export function CompanyMatchingResults({
  companies,
  onCompanySelect,
  matchingEngine
}: CompanyMatchingResultsProps) {
  const [displayedCount, setDisplayedCount] = useState(6);
  const [matchingResults, setMatchingResults] = useState<Array<Company & { matchScore: number; matchReason: string }>>([]);

  useEffect(() => {
    const results = matchingEngine.findMatchingCompanies();
    console.log('Matching results:', results); // デバッグ用
    setMatchingResults(results);
  }, [matchingEngine]);

  const handleShowMore = () => {
    setDisplayedCount(prev => prev + 6);
  };

  const showMoreButton = displayedCount < matchingResults.length;

  if (matchingResults.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          マッチする企業が見つかりませんでした。自己分析を完了してから再度お試しください。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">マッチング結果</h2>
      <CompanyGrid
        companies={matchingResults}
        displayedCount={displayedCount}
        showMoreButton={showMoreButton}
        onShowMore={handleShowMore}
      />
    </div>
  );
} 