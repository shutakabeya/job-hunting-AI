import { NextResponse } from 'next/server';
import { AgentManager } from '@/agents/AgentManager';
import { JobHuntingState } from '@/types/agent';

export async function GET(request: Request) {
  try {
    // エージェントマネージャーの初期化
    const agentManager = new AgentManager({});

    // 進捗状態の取得
    const progress = agentManager.getProgress();
    const currentPhase = agentManager.getCurrentPhase();
    const currentStep = agentManager.getCurrentStep();

    return NextResponse.json({
      progress,
      currentPhase,
      currentStep
    });
  } catch (error) {
    console.error('Progress API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // リクエストボディの解析
    const { phase, stepId, status, data } = await request.json();

    if (!phase || !stepId) {
      return NextResponse.json(
        { error: 'phase と stepId は必須です' },
        { status: 400 }
      );
    }

    // エージェントマネージャーの初期化
    const agentManager = new AgentManager({});

    // 進捗状態の更新
    const context: Partial<JobHuntingState> = {
      phase,
      currentStep: {
        id: stepId,
        type: phase,
        status: status || 'completed'
      }
    };

    agentManager.setState(context);

    // 更新後の状態を返す
    return NextResponse.json({
      progress: agentManager.getProgress(),
      currentPhase: agentManager.getCurrentPhase(),
      currentStep: agentManager.getCurrentStep()
    });
  } catch (error) {
    console.error('Progress API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
      },
      { status: 500 }
    );
  }
}

function calculateProgress(state: any) {
  switch (state.phase) {
    case 'self_analysis':
      return {
        current: state.context.currentStep ? 
          state.messages.filter(m => m.role === 'user').length : 0,
        total: 5, // 自己分析の質問数
        label: '自己分析'
      };
    case 'company_matching':
      return {
        current: state.matchingResults ? 1 : 0,
        total: 1,
        label: '企業マッチング'
      };
    case 'preparation':
      if (!state.currentFocus) {
        return {
          current: 0,
          total: 1,
          label: '準備フェーズ'
        };
      }
      const strategy = agentManager.getCompanyStrategy(state.currentFocus);
      if (!strategy) {
        return {
          current: 0,
          total: 1,
          label: '準備フェーズ'
        };
      }
      const completedTasks = strategy.tasks.filter(t => t.status === 'completed').length;
      return {
        current: completedTasks,
        total: strategy.tasks.length,
        label: `${strategy.companyName}の準備`
      };
    default:
      return {
        current: 0,
        total: 1,
        label: '進行中'
      };
  }
} 