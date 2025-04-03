import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not configured in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // クライアントサイドでの実行を許可
});

export async function performSelfAnalysis(questions) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: questions.join('\n') }],
  });

  return response.choices[0].message.content.trim();
}

export async function generatePreparationTips(companyProfile) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: `企業プロファイル: ${companyProfile}\n面接対策を提案してください。` }],
  });

  return response.choices[0].message.content.trim();
} 