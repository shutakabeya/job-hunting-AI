import React from 'react';
import { JobHuntingState } from '@/types';

interface ProgressProps {
  context: JobHuntingState;
}

const phases = [
  { id: 'initial', label: '開始' },
  { id: 'self-analysis', label: '自己分析' },
  { id: 'matching', label: '企業マッチング' },
  { id: 'feedback', label: 'フィードバック' },
  { id: 'todo', label: 'ToDo' },
];

export const Progress: React.FC<ProgressProps> = ({ context }) => {
  const { phase, currentStep, progress } = context;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between relative">
        {/* プログレスバー */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* フェーズマーカー */}
        {phases.map((p, index) => (
          <div
            key={p.id}
            className="relative z-10 flex flex-col items-center"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                phases.findIndex(phase => phase.id === p.id) <=
                phases.findIndex(phase => phase.id === phase)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm ${
                p.id === phase ? 'text-blue-500 font-semibold' : 'text-gray-500'
              }`}
            >
              {p.label}
            </span>
          </div>
        ))}
      </div>

      {/* 現在のステップ表示 */}
      {currentStep > 0 && (
        <div className="text-center text-sm text-gray-600 mt-2">
          ステップ {currentStep}
        </div>
      )}
    </div>
  );
}; 