import { BaseAgent } from './BaseAgent';
import { SelfAnalysisAgent } from './SelfAnalysisAgent';
import { CompanyMatchingAgent } from './CompanyMatchingAgent';
import { PreparationAgent } from './PreparationAgent';
import { Context, AgentResponse, StepProgress } from '@/types/agent';

interface AgentConfig {
  openaiApiKey?: string;
  cohereApiKey?: string;
}

interface JobHuntingState {
  phase: 'self_analysis' | 'company_matching' | 'preparation';
  progress: {
    self_analysis: {
      valuesAnalysis: StepProgress;
      careerAspirations: StepProgress;
      strengthsWeaknesses: StepProgress;
      skillsAssessment: StepProgress;
      experienceAnalysis: StepProgress;
    };
    company_matching: {
      initialPreferences: StepProgress;
      companyAnalysis: StepProgress;
      matchingResults: StepProgress;
    };
    preparation: {
      companyResearch: StepProgress;
      entrySheet: StepProgress;
      interview: StepProgress;
    };
  };
  currentStep?: {
    id: string;
    type: string;
    status: 'pending' | 'in_progress' | 'completed';
  };
}

export class AgentManager {
  private agents: {
    self_analysis: SelfAnalysisAgent;
    company_matching: CompanyMatchingAgent;
    preparation: PreparationAgent;
  };

  private state: JobHuntingState;

  constructor(config: AgentConfig) {
    // 初期状態の設定
    this.state = {
      phase: 'self_analysis',
      progress: {
        self_analysis: {
          valuesAnalysis: { completed: false },
          careerAspirations: { completed: false },
          strengthsWeaknesses: { completed: false },
          skillsAssessment: { completed: false },
          experienceAnalysis: { completed: false }
        },
        company_matching: {
          initialPreferences: { completed: false },
          companyAnalysis: { completed: false },
          matchingResults: { completed: false }
        },
        preparation: {
          companyResearch: { completed: false },
          entrySheet: { completed: false },
          interview: { completed: false }
        }
      }
    };

    // エージェントの初期化
    this.agents = {
      self_analysis: new SelfAnalysisAgent(
        'Self Analysis Agent',
        '自己分析エージェント',
        '自己分析と強み発見',
        ['自己分析', 'キャリアプランニング'],
        this.state,
        config
      ),
      company_matching: new CompanyMatchingAgent(
        'Company Matching Agent',
        '企業マッチングエージェント',
        '企業分析とマッチング',
        ['企業分析', '適性診断'],
        this.state,
        config
      ),
      preparation: new PreparationAgent(
        'Preparation Agent',
        '就活準備エージェント',
        'エントリーシート・面接対策',
        ['書類作成', '面接練習'],
        this.state,
        config
      )
    };
  }

  setState(newState: Partial<JobHuntingState>): void {
    this.state = {
      ...this.state,
      ...newState
    };
    
    // 各エージェントの状態も更新
    Object.values(this.agents).forEach(agent => {
      agent.setContext(this.state);
    });
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const currentAgent = this.getCurrentAgent();
    
    try {
      const response = await currentAgent.processMessage(message);
      
      // コンテキストの更新
      if (response.context) {
        this.updateState(response.context);
      }

      // フェーズの遷移チェック
      if (response.context?.phase && response.context.phase !== this.state.phase) {
        await this.handlePhaseTransition(response.context.phase);
      }

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        message: 'エラーが発生しました。もう一度お試しください。',
        context: this.state
      };
    }
  }

  private getCurrentAgent(): BaseAgent {
    return this.agents[this.state.phase];
  }

  private updateState(context: Partial<JobHuntingState>): void {
    this.state = {
      ...this.state,
      ...context
    };

    // 各エージェントのコンテキストも更新
    Object.values(this.agents).forEach(agent => {
      agent.setContext(this.state);
    });
  }

  private async handlePhaseTransition(newPhase: JobHuntingState['phase']): Promise<void> {
    // 前のフェーズの完了処理
    const currentAgent = this.getCurrentAgent();
    await this.finalizePhase(currentAgent);

    // 新しいフェーズの開始
    this.state.phase = newPhase;
    const nextAgent = this.getCurrentAgent();
    await this.initializePhase(nextAgent);
  }

  private async finalizePhase(agent: BaseAgent): Promise<void> {
    // フェーズ完了時の処理
    const phaseData = await agent.getPhaseData();
    
    // 次のフェーズのエージェントにデータを送信
    const nextPhase = this.getNextPhase(this.state.phase);
    if (nextPhase) {
      const nextAgent = this.agents[nextPhase];
      nextAgent.receiveData({
        type: `${this.state.phase}_complete`,
        data: phaseData
      });
    }
  }

  private async initializePhase(agent: BaseAgent): Promise<void> {
    // 新しいフェーズの初期化
    await agent.initialize();
  }

  private getNextPhase(currentPhase: JobHuntingState['phase']): JobHuntingState['phase'] | undefined {
    const phases: JobHuntingState['phase'][] = ['self_analysis', 'company_matching', 'preparation'];
    const currentIndex = phases.indexOf(currentPhase);
    return phases[currentIndex + 1];
  }

  getProgress(): JobHuntingState['progress'] {
    return this.state.progress;
  }

  getCurrentPhase(): JobHuntingState['phase'] {
    return this.state.phase;
  }

  getCurrentStep(): JobHuntingState['currentStep'] | undefined {
    return this.state.currentStep;
  }
} 