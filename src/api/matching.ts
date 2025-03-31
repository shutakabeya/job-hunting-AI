import { performSelfAnalysis } from './openai';
import { matchCompanies } from './cohere';

export async function analyzeAndMatch(userQuestions) {
  // 自己分析を実行
  const selfAnalysisResult = await performSelfAnalysis(userQuestions);

  // 自己分析の結果を使用して企業マッチングを実行
  const matchingResults = await matchCompanies(selfAnalysisResult);

  return {
    selfAnalysisResult,
    matchingResults,
  };
} 