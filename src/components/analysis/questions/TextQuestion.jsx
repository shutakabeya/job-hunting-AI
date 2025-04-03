'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAnalysisStore from '../../../store/analysisStore';

export default function TextQuestion({ question }) {
  const { setAnswer, nextQuestion, prevQuestion, answers } = useAnalysisStore();
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  // 既存の回答があれば読み込む
  useEffect(() => {
    if (answers[question.id]) {
      setInputValue(answers[question.id]);
      setIsValid(true);
    }
  }, [question.id, answers]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsValid(value.trim().length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      setAnswer(question.id, inputValue);
      nextQuestion();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {question.question}
        </h3>
        {question.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {question.description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="ここに回答を入力してください..."
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevQuestion}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            戻る
          </button>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isValid
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            次へ
          </motion.button>
        </div>
      </form>
    </div>
  );
} 