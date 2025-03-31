'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAnalysisStore from '../../../store/analysisStore';

export default function ChoiceQuestion({ question }) {
  const { setAnswer, nextQuestion, prevQuestion, answers } = useAnalysisStore();
  const [selectedChoice, setSelectedChoice] = useState(null);

  // 既存の回答があれば読み込む
  useEffect(() => {
    if (answers[question.id]) {
      setSelectedChoice(answers[question.id]);
    }
  }, [question.id, answers]);

  const handleChoiceSelect = (choiceId) => {
    setSelectedChoice(choiceId);
    setAnswer(question.id, choiceId);
    
    // 選択後、少し遅延してから次の質問へ
    setTimeout(() => {
      nextQuestion();
    }, 500);
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

      <div className="space-y-3">
        {question.choices.map((choice) => (
          <motion.div
            key={choice.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleChoiceSelect(choice.id)}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                selectedChoice === choice.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {choice.text}
            </button>
          </motion.div>
        ))}
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
          disabled={!selectedChoice}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedChoice
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          スキップ
        </button>
      </div>
    </div>
  );
} 