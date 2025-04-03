import React, { useState } from 'react';
import { analyzeAndMatch } from '../api/matching';
import { prepareForCompanies } from '../api/preparation';
import useTaskStore from '../store/taskStore';

const JobHuntFlow: React.FC = () => {
  const [userQuestions, setUserQuestions] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [preparationTips, setPreparationTips] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { tasks, addTask } = useTaskStore();

  const handleStartAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const { selfAnalysisResult, matchingResults } = await analyzeAndMatch(userQuestions);
      setAnalysisResult(selfAnalysisResult);
      setMatchingResults(matchingResults);

      const tips = await prepareForCompanies(matchingResults);
      setPreparationTips(tips);
    } catch (err) {
      setError('エラーが発生しました。再試行してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">自己分析</h2>
        <div className="space-y-4">
          <textarea
            value={userQuestions.join('\n')}
            onChange={(e) => setUserQuestions(e.target.value.split('\n'))}
            placeholder="質問を入力してください"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
          />
          <button
            onClick={handleStartAnalysis}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? '分析中...' : '分析開始'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {analysisResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">分析結果</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{analysisResult}</p>
          </div>
        </div>
      )}

      {matchingResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">企業マッチング結果</h2>
          <ul className="space-y-3">
            {matchingResults.map((result, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{result}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {preparationTips.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">対策</h2>
          <ul className="space-y-3">
            {preparationTips.map((tip, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800">{tip.company}</h3>
                <p className="text-gray-700 mt-2">{tip.tips}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">タスク管理</h2>
        <ul className="space-y-3 mb-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{task.description}</p>
            </li>
          ))}
        </ul>
        <button
          onClick={() => addTask('新しいタスク')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          タスク追加
        </button>
      </div>
    </div>
  );
};

export default JobHuntFlow; 