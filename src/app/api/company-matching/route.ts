import { NextRequest, NextResponse } from 'next/server';
import { getPineconeIndex } from '@/utils/pinecone';
import { vectorizeUserProfile, generateMatchReason } from '@/utils/vectorization';
import { UserProfile, Company, CompanyWithScore } from '@/types/company';

// サンプルの企業データ
const sampleCompanies: Company[] = [
  {
    id: '1',
    name: 'テックイノベーション株式会社',
    industry: 'IT・通信',
    description: '最先端のAI技術を活用したソリューションを提供',
    culture: '革新的で自由な社風、チャレンジを推奨',
    requiredSkills: ['プログラミング', 'AI/ML', 'コミュニケーション力'],
    benefits: ['フレックスタイム', 'リモートワーク', '書籍購入支援'],
    location: '東京都渋谷区',
    size: '従業員数300名',
    foundedYear: 2010
  },
  {
    id: '2',
    name: 'グローバルコネクト株式会社',
    industry: '商社',
    description: 'グローバルな貿易と事業開発を展開',
    culture: 'グローバルな環境、多様性を重視',
    requiredSkills: ['語学力', '異文化理解', 'ビジネス交渉力'],
    benefits: ['海外出張', '語学研修', '住宅手当'],
    location: '東京都千代田区',
    size: '従業員数1000名',
    foundedYear: 1985
  }
];

/**
 * ユーザープロファイルから企業マッチングを行うAPIエンドポイント
 */
export async function POST(req: NextRequest) {
  try {
    const { userProfile } = await req.json();

    if (!userProfile) {
      return NextResponse.json(
        { error: 'ユーザープロファイルが必要です' },
        { status: 400 }
      );
    }

    // ユーザープロファイルをベクトル化
    const userVector = await vectorizeUserProfile(userProfile);

    // マッチング結果を格納する配列
    const matchedCompanies: CompanyWithScore[] = [];

    // 各企業との類似度を計算
    for (const company of sampleCompanies) {
      try {
        // マッチング理由を生成
        const matchReason = await generateMatchReason(userProfile, company);

        // スコアは仮の値として0.5から1.0の間でランダムに設定
        const score = 0.5 + Math.random() * 0.5;

        matchedCompanies.push({
          ...company,
          score,
          matchReason
        });
      } catch (error) {
        console.error(`企業${company.name}のマッチング処理中にエラーが発生しました:`, error);
      }
    }

    // スコアの降順でソート
    matchedCompanies.sort((a, b) => b.score - a.score);

    return NextResponse.json({ companies: matchedCompanies });
  } catch (error) {
    console.error('企業マッチング処理中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: 'マッチング処理に失敗しました' },
      { status: 500 }
    );
  }
} 