'use client';

import { useState } from 'react';
import { UserProfile, CompanyWithScore } from '@/types/company';
import useAnalysisStore from '../store/analysisStore';

export function useCompanyMatching() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedCompanies, setMatchedCompanies] = useState<CompanyWithScore[]>([]);
  
  // 自己分析ストアから回答データを取得
  const { answers, recommendedEnvironment } = useAnalysisStore();

  /**
   * 自己分析の回答からユーザープロファイルを生成する
   */
  const generateUserProfile = (): UserProfile => {
    // 自己分析の回答から特性を抽出
    const traits = {
      creative: 0,
      stable: 0,
      teamwork: 0,
      challenge: 0,
    };
    
    // 質問2の選択肢に基づいて特性を加算
    if (answers[2] === 'a') traits.creative += 2;
    if (answers[2] === 'b') traits.stable += 2;
    if (answers[2] === 'c') traits.challenge += 2;
    if (answers[2] === 'd') traits.teamwork += 2;
    
    // 質問3のスワイプ回答に基づいて特性を加算
    const swipeAnswers = answers[3] || {};
    if (swipeAnswers.s1 === 'yes') traits.challenge += 1;
    if (swipeAnswers.s2 === 'yes') traits.stable += 1;
    if (swipeAnswers.s3 === 'yes') traits.teamwork += 1;
    if (swipeAnswers.s4 === 'yes') traits.stable += 1;
    if (swipeAnswers.s5 === 'yes') traits.creative += 1;
    
    // 質問1と質問5の回答から価値観と強みを抽出
    const values = answers[1] ? [answers[1]] : [];
    const strengths = answers[5] ? [answers[5]] : [];
    
    // 推奨環境から希望する働き方と業界を推測
    let preferredWorkStyle: string[] = [];
    let preferredIndustries: string[] = [];
    
    if (recommendedEnvironment) {
      switch (recommendedEnvironment.id) {
        case 'env1': // クリエイティブ志向
          preferredWorkStyle = ['フレックスタイム', 'リモートワーク可'];
          preferredIndustries = ['IT・テクノロジー', 'デザイン・クリエイティブ'];
          break;
        case 'env2': // 安定志向
          preferredWorkStyle = ['定時勤務', 'オフィスワーク中心'];
          preferredIndustries = ['金融', '公務員', '大手企業'];
          break;
        case 'env3': // チーム協働
          preferredWorkStyle = ['チーム制', 'プロジェクトベース'];
          preferredIndustries = ['コンサルティング', 'サービス業'];
          break;
        case 'env4': // 挑戦志向
          preferredWorkStyle = ['フレックスタイム', '成果主義'];
          preferredIndustries = ['IT・スタートアップ', 'ベンチャー企業'];
          break;
      }
    }
    
    // スキルは質問4の回答から推測
    const scaleAnswers = answers[4] || {};
    const skills: string[] = [];
    
    if (scaleAnswers.i1 >= 4) skills.push('論理的思考');
    if (scaleAnswers.i2 >= 4) skills.push('コミュニケーション能力');
    if (scaleAnswers.i3 >= 4) skills.push('粘り強さ');
    if (scaleAnswers.i4 >= 4) skills.push('多角的思考');
    
    return {
      id: 'user-1', // 実際のアプリではユーザーIDを使用
      values,
      skills,
      traits,
      preferredWorkStyle,
      preferredIndustries,
      strengths,
      answers,
    };
  };

  /**
   * 企業マッチングを実行する
   */
  const findMatchingCompanies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userProfile = generateUserProfile();
      
      const response = await fetch('/api/company-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '企業マッチングに失敗しました');
      }
      
      const data = await response.json();
      setMatchedCompanies(data.matches);
    } catch (err: any) {
      setError(err.message || '企業マッチング中にエラーが発生しました');
      console.error('企業マッチングエラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    matchedCompanies,
    findMatchingCompanies,
  };
} 