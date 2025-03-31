import OpenAI from 'openai';
import { ChatMessage } from './supabase';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing environment variable: OPENAI_API_KEY');
  }
  if (!openaiClient) {
    try {
      openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.error('OpenAIクライアントの初期化に失敗しました:', error);
      throw error;
    }
  }
  return openaiClient;
}

export async function generateResponse(
  message: string,
  chatHistory: ChatMessage[] = [],
  context?: {
    currentStep?: 'self_analysis' | 'company_matching' | 'task_management';
    metadata?: Record<string, any>;
  }
): Promise<string> {
  try {
    const openai = getOpenAIClient();

    // システムプロンプトを作成
    let systemPrompt = `あなたは就活支援AIアシスタントです。
以下の方針で応答してください：
1. 就活生の悩みや質問に親身に寄り添う
2. 具体的なアドバイスや行動提案を行う
3. 前向きで建設的な姿勢を保つ
4. 必要に応じて、自己分析や企業研究の方法を提案する
5. 敬語を使用し、丁寧に対応する`;

    // コンテキストに応じてシステムプロンプトを拡張
    if (context?.currentStep) {
      switch (context.currentStep) {
        case 'self_analysis':
          systemPrompt += `\n\n現在、ユーザーは自己分析のステップにいます。
- 価値観、強み、興味関心を深掘りする質問をする
- 具体的なエピソードを引き出す
- 気づきを言語化するサポートをする`;
          break;
        case 'company_matching':
          systemPrompt += `\n\n現在、ユーザーは企業マッチングのステップにいます。
- ユーザーの価値観や強みに合った企業を提案する
- 企業選びの判断基準をアドバイスする
- 業界研究や企業研究の方法を提案する`;
          break;
        case 'task_management':
          systemPrompt += `\n\n現在、ユーザーはタスク管理のステップにいます。
- 就活の進捗状況を確認する
- 次のアクションを具体的に提案する
- 締切管理や優先順位付けをサポートする`;
          break;
      }
    }

    // チャット履歴をメッセージ配列に変換
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ] as any[];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || 'すみません、応答を生成できませんでした。';
  } catch (error) {
    console.error('OpenAI APIの呼び出しに失敗しました:', error);
    return 'すみません、一時的にAIアシスタントが利用できません。しばらく経ってからお試しください。';
  }
} 