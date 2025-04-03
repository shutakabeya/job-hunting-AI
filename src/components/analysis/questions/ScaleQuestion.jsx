'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAnalysisStore from '../../../store/analysisStore';

export default function ScaleQuestion({ question }) {
  const { setAnswer, nextQuestion, prevQuestion, answers } = useAnalysisStore();
  const [ratings, setRatings] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  // 既存の回答があれば読み込む
  useEffect(() => {
    if (answers[question.id]) {
      setRatings(answers[question.id]);
      checkCompletion(answers[question.id]);
    }
  }, [question.id, answers]);

  // 全ての項目に回答したかチェック
  const checkCompletion = (currentRatings) => {
    const allAnswered = question.items.every(
      (item) => currentRatings[item.id] !== undefined
    );
    setIsComplete(allAnswered);
  };

  const handleRatingChange = (itemId, rating) => {
    const newRatings = {
      ...ratings,
      [itemId]: rating,
    };
    setRatings(newRatings);
    setAnswer(question.id, newRatings);
    checkCompletion(newRatings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {question.question}
        </h3>
        {question.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {question.items.map((item) => (
          <div key={item.id} className="space-y-2">
            <p className="text-gray-800 dark:text-gray-200">{item.text}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">全く当てはまらない</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRatingChange(item.id, rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      ratings[item.id] === rating
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>
              <span className="text-xs text-gray-500">非常に当てはまる</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={prevQuestion}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          戻る
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextQuestion}
          disabled={!isComplete}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isComplete
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          次へ
        </motion.button>
      </div>
    </div>
  );
} 