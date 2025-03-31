'use client';

import { useState, useEffect } from 'react';
import { CompanyProgress } from '@/types/task';
import useTaskStore from '@/store/taskStore';
import { Edit, Building } from 'lucide-react';
import CompanyProgressForm from './CompanyProgressForm';
import { CompanyWithScore } from '@/types/company';
import Card from '@/components/Card';

interface CompanyProgressListProps {
  companies: CompanyWithScore[];
}

export default function CompanyProgressList({ companies }: CompanyProgressListProps) {
  const { companyProgress, fetchCompanyProgress, isLoading, error } = useTaskStore();
  const [selectedProgress, setSelectedProgress] = useState<CompanyProgress | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // 仮のユーザーID（実際の実装では認証システムから取得）
  const userId = 'user-1';
  
  useEffect(() => {
    fetchCompanyProgress(userId);
  }, [fetchCompanyProgress]);
  
  const handleEditClick = (progress: CompanyProgress) => {
    setSelectedProgress(progress);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProgress(null);
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'interested': return '興味あり';
      case 'applied': return '応募済み';
      case 'interviewing': return '面接中';
      case 'offer': return '内定';
      case 'accepted': return '内定承諾';
      case 'rejected': return '不採用';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interested': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'applied': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'interviewing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'offer': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'accepted': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              企業選考進捗
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              企業ごとの選考状況を管理します
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => {
                setSelectedProgress(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              新しい企業を追加
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-lg">
            {error}
          </div>
        ) : companyProgress.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>企業の進捗情報がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companyProgress.map((progress) => (
              <div
                key={progress.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {progress.companyName}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleEditClick(progress)}
                    className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(progress.status)}`}>
                    {getStatusLabel(progress.status)}
                  </span>
                </div>
                
                {progress.notes && (
                  <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                    {progress.notes}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  最終更新: {formatDate(progress.lastUpdated)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <CompanyProgressForm
              companyProgress={selectedProgress || undefined}
              companies={companies}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
} 