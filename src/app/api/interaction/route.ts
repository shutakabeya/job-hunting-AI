import { NextResponse } from 'next/server';
import { AgentManager } from '@/agents/AgentManager';
import { JobHuntingState } from '@/types/agent';

export async function POST(request: Request) {
  try {
    // APIキーの検証
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI APIキーが設定されていません');
    }

    // リクエストボディの解析
    const { elementId, action, data, context } = await request.json();

    if (!elementId || !action) {
      return NextResponse.json(
        { error: 'elementIdとactionは必須です' },
        { status: 400 }
      );
    }

    // エージェントマネージャーの初期化
    const agentManager = new AgentManager({
      openaiApiKey: apiKey
    });

    // 既存のコンテキストがある場合は設定
    if (context) {
      agentManager.setState(context as Partial<JobHuntingState>);
    }

    // インタラクションの処理
    let response;
    switch (action) {
      case 'select_company':
        response = await agentManager.processMessage(JSON.stringify(data));
        break;

      case 'complete_task':
        response = await agentManager.processMessage(`タスク「${data.taskId}」を完了しました`);
        break;

      case 'start_task':
        response = await agentManager.processMessage(`タスク「${data.taskId}」を開始します`);
        break;

      case 'update_preferences':
        response = await agentManager.processMessage(JSON.stringify(data.preferences));
        break;

      default:
        return NextResponse.json(
          { error: '不明なアクションです' },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Interaction API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
      },
      { status: 500 }
    );
  }
} 