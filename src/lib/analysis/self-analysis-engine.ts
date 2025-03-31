import { SelfAnalysisData } from '../utils/csv-loader';

export class SelfAnalysisEngine {
  private rawData: SelfAnalysisData | null = null;
  private currentQuestionIndex: number = 0;
  private userVector: Record<string, number> = {
    workStyle: 0,
    organization: 0,
    growth: 0,
    values: 0,
    relationships: 0,
    customerContact: 0,
    businessStyle: 0,
    evaluation: 0,
    diversity: 0,
    stability: 0
  };

  async initialize(): Promise<void> {
    try {
      const { loadSelfAnalysisData } = await import('../utils/csv-loader');
      const data = await loadSelfAnalysisData();
      console.log('自己分析エンジン初期化:', data);

      if (!data || !data.questions) {
        throw new Error('自己分析データの形式が不正です');
      }

      this.rawData = data;
      console.log('自己分析エンジン初期化完了');
    } catch (error) {
      console.error('自己分析エンジンの初期化エラー:', error);
      throw error;
    }
  }

  getCurrentQuestion() {
    if (!this.rawData || !this.rawData.questions) {
      throw new Error('自己分析データが初期化されていません');
    }

    if (this.currentQuestionIndex >= this.rawData.questions.length) {
      return null;
    }

    return this.rawData.questions[this.currentQuestionIndex];
  }

  handleAnswer(optionId: string): void {
    if (!this.rawData || !this.rawData.questions) {
      throw new Error('自己分析データが初期化されていません');
    }

    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error('現在の設問が見つかりません');
    }

    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    if (!selectedOption) {
      throw new Error('選択された選択肢が見つかりません');
    }

    // ユーザーベクトルを更新
    Object.entries(selectedOption.weights).forEach(([key, value]) => {
      this.userVector[key] += value;
    });

    this.currentQuestionIndex++;
  }

  getUserVector(): Record<string, number> {
    return { ...this.userVector };
  }

  reset(): void {
    this.currentQuestionIndex = 0;
    this.userVector = {
      workStyle: 0,
      organization: 0,
      growth: 0,
      values: 0,
      relationships: 0,
      customerContact: 0,
      businessStyle: 0,
      evaluation: 0,
      diversity: 0,
      stability: 0
    };
  }
} 