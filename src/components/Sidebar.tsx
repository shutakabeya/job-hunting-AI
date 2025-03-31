'use client';

import { 
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  BarChart2,
  HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const { progressState } = useProgress();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`
        relative bg-white border-r border-gray-200 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50"
      >
        {isCollapsed ? <ChevronRight className="text-gray-700" /> : <ChevronLeft className="text-gray-700" />}
      </button>

      <div className="p-4 flex flex-col h-full overflow-y-auto">
        {/* プログレスサマリー */}
        <div className={`mb-6 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center mb-2">
            <BarChart2 className="w-5 h-5 text-gray-600" />
            {!isCollapsed && <span className="ml-2 font-medium text-gray-900">進捗状況</span>}
          </div>
          {!isCollapsed && progressState && (
            <div className="text-sm text-gray-700">
              <p>現在のステップ: {progressState.currentStep}</p>
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ 
                      width: `${(progressState.completedSteps / progressState.totalSteps) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* クイックアクション */}
        <div className={`mb-6 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-gray-600" />
            {!isCollapsed && <span className="ml-2 font-medium text-gray-900">クイックアクション</span>}
          </div>
          {!isCollapsed && (
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                自己PR作成
              </button>
              <button className="p-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                面接練習
              </button>
            </div>
          )}
        </div>

        {/* セッション履歴 */}
        <div className={`mb-6 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            {!isCollapsed && <span className="ml-2 font-medium text-gray-900">最近の活動</span>}
          </div>
          {!isCollapsed && (
            <div className="text-sm text-gray-700">
              <div className="p-2 rounded-md hover:bg-gray-50 transition-colors">
                <p className="text-gray-800">自己分析</p>
                <p className="text-xs text-gray-500">最終更新: 今日</p>
              </div>
            </div>
          )}
        </div>

        {/* ヘルプ */}
        <div className={`mb-6 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center mb-2">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            {!isCollapsed && <span className="ml-2 font-medium text-gray-900">ヘルプ</span>}
          </div>
          {!isCollapsed && (
            <div className="text-sm text-gray-700">
              <p>AIがあなたの就活をサポートします。</p>
              <p>チャットで質問や相談ができます。</p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 text-center">
              <p>© 2024 Job Hunt AI</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 