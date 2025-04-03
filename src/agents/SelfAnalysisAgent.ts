import { BaseAgent } from './BaseAgent';
import { Context, AgentResponse, StepProgress } from '@/types/agent';
import { OpenAI } from 'openai';

interface AnalysisStep {
  id: string;
  category: string;
  question: string;
  nextStep?: string;
}

export class SelfAnalysisAgent extends BaseAgent {
  private steps: AnalysisStep[] = [
    {
      id: 'values',
      category: '価値観分析',
      question: 'あなたが仕事や生活で大切にしている価値観を教えてください。',
      nextStep: 'career'
    },
    {
      id: 'career',
      category: 'キャリア志向',
      question: '将来のキャリアについて、どのような目標や展望をお持ちですか？',
      nextStep: 'strengths'
    },
    {
      id: 'strengths',
      category: '強み分析',
      question: 'あなたの強みや得意分野を具体的に教えてください。',
      nextStep: 'skills'
    },
    {
      id: 'skills',
      category: 'スキル評価',
      question: '現在持っているスキルや資格について教えてください。',
      nextStep: 'experience'
    },
    {
      id: 'experience',
      category: '経験分析',
      question: 'これまでの経験（学業、アルバイト、課外活動など）で得た学びを教えてください。'
    }
  ];

  private analysisResults: Record<string, any> = {};

  initialize(): void {
    this.analysisResults = {};
    this.messageQueue = [];
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const currentStep = this.getCurrentStep();
    
    if (!currentStep) {
      return this.createResponse(
        '自己分析が完了しました。企業マッチングに進みましょう。',
        {
          phase: 'company_matching',
          currentStep: {
            id: 'initial',
            type: 'matching',
            status: 'pending'
          }
        }
      );
    }

    // 現在のステップの回答を分析
    const analysis = await this.analyzeResponse(message, currentStep);
    this.analysisResults[currentStep.id] = analysis;

    // 進捗を更新
    this.updateProgress(currentStep.id, analysis);

    // 次のステップを決定
    const nextStep = this.steps.find(step => step.id === currentStep.nextStep);
    
    if (!nextStep) {
      // 全ステップ完了
      const summary = await this.generateSummary();
      await this.sendMessage('company_matching', 'data_transfer', {
        type: 'analysis_complete',
        results: this.analysisResults,
        summary
      });

      return this.createResponse(summary, {
        phase: 'company_matching',
        currentStep: {
          id: 'initial',
          type: 'matching',
          status: 'pending'
        }
      });
    }

    // 次の質問を返す
    return this.createResponse(nextStep.question, {
      currentStep: {
        id: nextStep.id,
        type: 'analysis',
        status: 'in_progress'
      }
    });
  }

  receiveData(data: any): void {
    // 他のエージェントからのデータを処理
    console.log('Received data:', data);
  }

  private getCurrentStep(): AnalysisStep | undefined {
    const currentStepId = this.context.currentStep?.id;
    return this.steps.find(step => step.id === currentStepId);
  }

  private async analyzeResponse(message: string, step: AnalysisStep): Promise<any> {
    if (!this.config?.openaiApiKey) {
      return { error: 'OpenAI API key is not configured' };
    }

    const openai = new OpenAI({ apiKey: this.config.openaiApiKey });
    
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `あなたは就職活動支援のエキスパートで、特に${step.category}の分析を担当しています。
ユーザーの回答から重要なポイントを抽出し、構造化されたデータとして返してください。`
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "gpt-4",
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Analysis error:', error);
      return { error: 'Failed to analyze response' };
    }
  }

  private updateProgress(stepId: string, analysis: any): void {
    const progress = this.context.progress.self_analysis;
    const stepKey = this.getProgressKey(stepId);
    
    if (stepKey && stepKey in progress) {
      (progress[stepKey as keyof typeof progress] as StepProgress) = {
        completed: true,
        timestamp: Date.now(),
        data: analysis
      };
    }
  }

  private getProgressKey(stepId: string): string | undefined {
    const keyMap: Record<string, string> = {
      values: 'valuesAnalysis',
      career: 'careerAspirations',
      strengths: 'strengthsWeaknesses',
      skills: 'skillsAssessment',
      experience: 'experienceAnalysis'
    };
    return keyMap[stepId];
  }

  private async generateSummary(): Promise<string> {
    const summary = Object.entries(this.analysisResults)
      .map(([category, data]) => {
        return `【${this.steps.find(s => s.id === category)?.category}】\n${JSON.stringify(data, null, 2)}`;
      })
      .join('\n\n');

    return `自己分析の結果をまとめました：\n\n${summary}\n\nこの結果を基に、企業とのマッチング分析を行います。`;
  }

  protected async generateResponse(message: string): Promise<string> {
    const currentStep = this.getCurrentStep();
    return currentStep ? currentStep.question : '自己分析が完了しました。';
  }
} 