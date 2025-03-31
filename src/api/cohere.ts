import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient(process.env.COHERE_API_KEY);

export async function matchCompanies(userProfile) {
  const response = await cohere.classify({
    inputs: [userProfile],
    examples: [
      { text: 'エンジニアリング', label: 'Tech Company' },
      { text: 'マーケティング', label: 'Marketing Company' },
      // 他の例を追加
    ],
  });

  return response.body.classifications;
} 