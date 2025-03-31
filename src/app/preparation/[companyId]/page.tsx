'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useJobHunting } from '@/hooks/useJobHunting';
import { useRouter } from 'next/navigation';
import {
  Book,
  FileText,
  Users,
  Clock,
  ChevronRight,
  Building2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { CompanyMatch } from '@/types';

const taskTypeIcons = {
  research: Building2,
  writing: FileText,
  interview: Users,
  custom: Book
};

export default function PreparationPage({
  params
}: {
  params: { companyId: string }
}) {
  const router = useRouter();
  const { getCompanyStrategy, updateTaskStatus, setCurrentPhase } = useJobHunting();
  const [strategy, setStrategy] = useState<CompanyMatch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 企業選択時にpreparationフェーズに設定
        if (setCurrentPhase) {
          setCurrentPhase('preparation');
        }

        // 企業の戦略を取得
        const companyStrategy = await getCompanyStrategy(params.companyId);
        setStrategy(companyStrategy);
      } catch (error) {
        console.error('データの読み込みエラー:', error);
        router.push('/companies');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.companyId, getCompanyStrategy, setCurrentPhase, router]);

  const handleStatusChange = (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    updateTaskStatus(params.companyId, taskId, status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">企業データが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{strategy.company.name}の選考準備</h1>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">タスク一覧</h2>
            <div className="space-y-4">
              {strategy.tasks.map((task) => {
                const Icon = taskTypeIcons[task.type] || Book;
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{task.title}</h4>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                            className="text-sm border rounded px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">未着手</option>
                            <option value="in_progress">進行中</option>
                            <option value="completed">完了</option>
                          </select>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        {task.deadline && (
                          <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>期限: {task.deadline.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 