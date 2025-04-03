import { UserProfile, Company } from '@/types/company';
import { OpenAI } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing environment variable: OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ユーザープロファイルをベクトル化する
 */
export async function vectorizeUserProfile(profile: UserProfile): Promise<number[]> {
  try {
    const text = `
      職歴: ${profile.workHistory}
      スキル: ${profile.skills.join(', ')}
      興味: ${profile.interests.join(', ')}
      価値観: ${profile.values.join(', ')}
    `;

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('プロフィールのベクトル化に失敗しました:', error);
    throw error;
  }
}

/**
 * 企業データをベクトル化する
 */
export async function vectorizeCompany(company: Company): Promise<number[]> {
  try {
    const companyText = `
      企業名: ${company.name}
      説明: ${company.description}
      業界: ${company.industry}
      規模: ${company.size}
      企業文化: ${company.culture}
      求めるスキル: ${company.requiredSkills.join(', ')}
      福利厚生: ${company.benefits.join(', ')}
      所在地: ${company.location}
      設立年: ${company.foundedYear}
    `;

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: companyText,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('企業情報のベクトル化に失敗しました:', error);
    throw error;
  }
}

/**
 * ユーザープロファイルと企業の適合理由を生成する
 */
export async function generateMatchReason(
  userProfile: UserProfile,
  company: Company
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'あなたは就活支援AIアシスタントです。ユーザーのプロフィールと企業情報を分析し、マッチングの理由を説明してください。'
        },
        {
          role: 'user',
          content: `
ユーザープロフィール:
- 職歴: ${userProfile.workHistory}
- スキル: ${userProfile.skills.join(', ')}
- 興味: ${userProfile.interests.join(', ')}
- 価値観: ${userProfile.values.join(', ')}

企業情報:
- 企業名: ${company.name}
- 業界: ${company.industry}
- 事業内容: ${company.description}
- 企業文化: ${company.culture}
- 求める人材: ${company.requiredSkills.join(', ')}

このユーザーと企業のマッチング理由を3点に絞って、簡潔に説明してください。`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || 'マッチング理由を生成できませんでした。';
  } catch (error) {
    console.error('マッチング理由の生成に失敗しました:', error);
    return '申し訳ありません。マッチング理由の生成中にエラーが発生しました。';
  }
}

/**
 * コサイン類似度を計算する
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('ベクトルの次元が一致しません');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  // コサイン類似度は-1から1の範囲なので、0から1の範囲に正規化
  return (dotProduct / (normA * normB) + 1) / 2;
} 