import { NextResponse } from 'next/server';
import { AgentManager } from '@/agents/AgentManager';
import { JobHuntingState } from '@/types/agent';

// APIキーの検証
const validateApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません');
  }
  return apiKey;
};

export async function POST(request: Request) {
  try {
    // リクエストボディの解析
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }

    // エージェントマネージャーの初期化
    const agentManager = new AgentManager({});

    // 既存のコンテキストがある場合は設定
    if (context) {
      agentManager.setState(context as Partial<JobHuntingState>);
    }

    // メッセージの処理
    const response = await agentManager.processMessage(message);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
      },
      { status: 500 }
    );
  }
} 