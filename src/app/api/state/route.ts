import { NextResponse } from 'next/server';
import { AgentManager } from '@/agents/AgentManager';

// シングルトンインスタンスを再利用
const agentManager = new AgentManager();

export async function GET() {
  try {
    const state = agentManager.getState();
    return NextResponse.json(state);
  } catch (error) {
    console.error('State API Error:', error);
    return NextResponse.json(
      { error: '状態の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { focus } = await request.json();

    if (focus) {
      agentManager.setFocus(focus);
    }

    const state = agentManager.getState();
    return NextResponse.json(state);
  } catch (error) {
    console.error('State API Error:', error);
    return NextResponse.json(
      { error: '状態の更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 