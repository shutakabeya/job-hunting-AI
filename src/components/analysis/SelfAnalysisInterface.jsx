'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAnalysisStore from '../../store/analysisStore';
import Card from '../interactive/Card';
import TextQuestion from './questions/TextQuestion';
import ChoiceQuestion from './questions/ChoiceQuestion';
import SwipeQuestion from './questions/SwipeQuestion';
import ScaleQuestion from './questions/ScaleQuestion';
import ResultsView from './ResultsView';

export default function SelfAnalysisInterface() {
  const {
    currentQuestionIndex,
    questions,
    isCompleted,
    recommendedEnvironment,
    getCurrentQuestion,
    resetAnalysis,
  } = useAnalysisStore();

  const [direction, setDirection] = useState(1); // 1: 前進, -1: 後退
  const currentQuestion = getCurrentQuestion();

  // 質問タイプに基づいて適切なコンポーネントをレンダリング
  const renderQuestionComponent = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'text':
        return <TextQuestion question={currentQuestion} />;
      case 'choice':
        return <ChoiceQuestion question={currentQuestion} />;
      case 'swipe':
        return <SwipeQuestion question={currentQuestion} />;
      case 'scale':
        return <ScaleQuestion question={currentQuestion} />;
      default:
        return null;
    }
  };

  // 進捗バーの計算
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {!isCompleted ? (
        <div className="space-y-6">
          {/* 進捗バー */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
            <motion.div
              className="bg-blue-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* 質問カウンター */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            質問 {currentQuestionIndex + 1} / {questions.length}
          </div>

          {/* 質問コンポーネント */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ 
                x: direction * 50, 
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                opacity: 1 
              }}
              exit={{ 
                x: direction * -50, 
                opacity: 0 
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full">
                {renderQuestionComponent()}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <ResultsView 
          recommendedEnvironment={recommendedEnvironment} 
          onReset={resetAnalysis} 
        />
      )}
    </div>
  );
} 