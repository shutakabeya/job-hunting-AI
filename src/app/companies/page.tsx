'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJobHunting } from '@/hooks/useJobHunting';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, ArrowRight } from 'lucide-react';

export default function CompaniesPage() {
  const router = useRouter();
  const { matchingResults } = useJobHunting();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">企業マッチング</h2>
          </div>

          {!matchingResults ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-lg">企業とのマッチングを分析中...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {matchingResults.map((match, index) => (
                <motion.div
                  key={match.company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border p-6 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-6 w-6 text-blue-500" />
                        <h3 className="text-xl font-semibold">{match.company.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          マッチング度 {match.matchScore}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{match.company.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">マッチングポイント</h4>
                      <ul className="mt-2 grid grid-cols-1 gap-2">
                        {match.matchingPoints.map((point, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">課題ポイント</h4>
                      <ul className="mt-2 grid grid-cols-1 gap-2">
                        {match.challengePoints.map((point, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                            <ArrowRight className="h-4 w-4 text-orange-500" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => router.push(`/preparation/${match.company.id}`)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
                    >
                      準備を始める
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 