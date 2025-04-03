'use client';

import { motion } from 'framer-motion';
import Card from '../../components/Card';
import Link from 'next/link';

export default function ResultsView({ recommendedEnvironment, onReset }) {
  if (!recommendedEnvironment) {
    return (
      <Card className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          分析結果を読み込めませんでした
        </h3>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          もう一度試す
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center p-8">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full mb-4">
              分析完了
            </span>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              あなたに最適な企業環境
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              あなたの回答に基づいて、最も適した企業環境を分析しました。
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-6">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
              {recommendedEnvironment.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {recommendedEnvironment.description}
            </p>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                マッチングポイント
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendedEnvironment.matchingPoints.map((point, index) => (
                  <span
                    key={index}
                    className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-sm"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                企業例
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendedEnvironment.examples.map((example, index) => (
                  <span
                    key={index}
                    className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-sm"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              もう一度分析する
            </button>
            <Link href="/companies">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                企業を探す
              </button>
            </Link>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            次のステップ
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  企業研究を深める
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  あなたに合った企業環境を持つ企業について詳しく調べましょう。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  自己PRを作成する
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  分析結果を活かして、あなたの強みを伝えるエピソードを考えましょう。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-800 dark:text-blue-200 font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  面接対策を行う
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  あなたの価値観や強みを面接でどう伝えるか準備しましょう。
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 