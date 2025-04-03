'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import useAnalysisStore from '../../../store/analysisStore';

export default function SwipeQuestion({ question }) {
  const { setAnswer, nextQuestion, prevQuestion, answers } = useAnalysisStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const controls = useAnimation();

  // 既存の回答があれば読み込む
  useEffect(() => {
    if (answers[question.id]) {
      setResponses(answers[question.id]);
    }
  }, [question.id, answers]);

  const handleSwipe = async (direction) => {
    let response;
    if (direction === 'left') {
      response = 'no';
    } else if (direction === 'right') {
      response = 'yes';
    } else {
      response = 'neutral';
    }

    // 現在の文の回答を保存
    const currentStatement = question.statements[currentIndex];
    const newResponses = {
      ...responses,
      [currentStatement.id]: response,
    };
    setResponses(newResponses);
    setAnswer(question.id, newResponses);

    // アニメーション
    await controls.start({
      x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
      opacity: 0,
      transition: { duration: 0.3 },
    });

    // 次の文へ
    if (currentIndex < question.statements.length - 1) {
      setCurrentIndex(currentIndex + 1);
      controls.set({ x: 0, opacity: 1 });
    } else {
      // 全ての文に回答した場合、次の質問へ
      nextQuestion();
    }
  };

  // 進捗バーの計算
  const progress = ((currentIndex + 1) / question.statements.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {question.question}
        </h3>
        
        {/* 進捗バー（サブ質問用） */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
          <motion.div
            className="bg-green-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} / {question.statements.length}
        </p>
      </div>

      <div className="relative h-40 flex items-center justify-center">
        <motion.div
          animate={controls}
          className="absolute w-full text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <p className="text-lg text-gray-800 dark:text-gray-200">
            {question.statements[currentIndex]?.text}
          </p>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe('left')}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md"
        >
          いいえ
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe('neutral')}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md"
        >
          どちらでもない
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSwipe('right')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md"
        >
          はい
        </motion.button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={prevQuestion}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          戻る
        </button>
        <button
          onClick={nextQuestion}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          スキップ
        </button>
      </div>
    </div>
  );
} 