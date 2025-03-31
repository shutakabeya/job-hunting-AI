import { Question, UserVector } from '@/types';
import { CsvLoader, SelfAnalysisData } from '../utils/csv-loader';

interface SelfAnalysisQuestion {
  id: string;
  prompt: string;
  options: Array<{
    id: string;
    text: string;
    weights: {
      workStyle: number;
      organization: number;
      growth: number;
      values: number;
      relationships: number;
      customerContact: number;
      businessStyle: number;
      evaluation: number;
      diversity: number;
      stability: number;
    };
  }>;
}

export class SelfAnalysisEngine {
  private questions: Question[] = [];
  private currentQuestionIndex: number = 0;
  private answers: Map<string, string> = new Map();
  private rawData: SelfAnalysisData | null = null;
  private isInitialized: boolean = false;
  private csvLoader: CsvLoader;

  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answers = new Map();
    this.csvLoader = new CsvLoader();
  }

  async initialize(): Promise<void> {
    try {
      this.rawData = await this.csvLoader.loadSelfAnalysisData();
      
      // デバッグ: 読み込んだデータを確認
      console.log('自己分析エンジン初期化:', {
        totalQuestions: this.rawData.questions.length,
        sampleQuestion: this.rawData.questions[0]
      });

      // 質問データを変換
      this.questions = this.rawData.questions.map(question => ({
        id: question.id,
        prompt: question.prompt,
        options: question.options.map(option => {
          // 各カテゴリの重みを取得
          const weights = {
            workStyle: Number(option.weights.workStyle) || 0,
            organization: Number(option.weights.organization) || 0,
            growth: Number(option.weights.growth) || 0,
            values: Number(option.weights.values) || 0,
            relationships: Number(option.weights.relationships) || 0,
            customerContact: Number(option.weights.customerContact) || 0,
            businessStyle: Number(option.weights.businessStyle) || 0,
            evaluation: Number(option.weights.evaluation) || 0,
            diversity: Number(option.weights.diversity) || 0,
            stability: Number(option.weights.stability) || 0
          };

          // 重みの最大値を取得
          const maxWeight = Math.max(...Object.values(weights));

          // 重みを0-1の範囲に正規化
          const normalizedWeights = Object.entries(weights).reduce((acc, [key, value]) => {
            acc[key] = maxWeight > 0 ? value / maxWeight : 0;
            return acc;
          }, {} as typeof weights);

          return {
            id: option.id,
            text: option.text || '',
            weights: normalizedWeights
          };
        })
      }));

      // デバッグ: 変換後の質問データを確認
      console.log('変換後の質問データ:', {
        totalQuestions: this.questions.length,
        sampleQuestion: this.questions[0]
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('自己分析エンジンの初期化エラー:', error);
      throw error;
    }
  }

  getCurrentQuestion(): SelfAnalysisQuestion | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }

    const question = this.questions[this.currentQuestionIndex];
    if (!question) {
      console.warn('質問が見つかりません:', this.currentQuestionIndex);
      return null;
    }

    // デバッグ: 現在の質問の内容を確認
    console.log('現在の質問:', {
      id: question.id,
      prompt: question.prompt,
      options: question.options.map(o => ({
        id: o.id,
        text: o.text,
        weights: o.weights
      }))
    });

    return {
      id: question.id,
      prompt: question.prompt,
      options: question.options.map(option => ({
        id: option.id,
        text: option.text,
        weights: option.weights
      }))
    };
  }

  async submitAnswer(answerId: string): Promise<void> {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      if (this.isComplete()) {
        console.log('すべての質問に回答が完了しました');
        return;
      }
      console.error('質問の状態:', {
        currentIndex: this.currentQuestionIndex,
        totalQuestions: this.questions.length,
        isInitialized: this.isInitialized
      });
      throw new Error('現在の質問が見つかりません。質問の初期化が正しく行われていない可能性があります。');
    }

    // デバッグ: 回答を確認
    console.log('回答を保存:', {
      questionId: currentQuestion.id,
      answerId,
      question: currentQuestion.prompt,
      options: currentQuestion.options
    });

    // 選択肢が存在するか確認
    const option = currentQuestion.options.find(o => o.id === answerId);
    if (!option) {
      throw new Error(`選択肢 "${answerId}" が見つかりません。`);
    }

    this.answers.set(currentQuestion.id, answerId);
    this.currentQuestionIndex++;

    // デバッグ: 回答の保存を確認
    console.log('回答が保存されました:', {
      totalAnswers: this.answers.size,
      currentIndex: this.currentQuestionIndex
    });
  }

  calculateUserVector(): number[] {
    const vector = new Array(10).fill(0);
    const categoryCounts = new Array(10).fill(0); // Count of weights for each category
    const categorySums = new Array(10).fill(0); // Total weights for each category

    // Debugging: Check answer data
    console.log('回答データ:', Array.from(this.answers.entries()).map(([qId, aId]) => ({
      questionId: qId,
      answerId: aId,
      question: this.questions.find(q => q.id === qId)?.prompt,
      answer: this.questions.find(q => q.id === qId)?.options.find(o => o.id === aId)?.text,
      weights: this.questions.find(q => q.id === qId)?.options.find(o => o.id === aId)?.weights
    })));

    // Add weights for each answer
    this.answers.forEach((answerId, questionId) => {
      const question = this.questions.find(q => q.id === questionId);
      if (!question) {
        console.warn(`質問が見つかりません: ${questionId}`);
        return;
      }

      const option = question.options.find(o => o.id === answerId);
      if (!option) {
        console.warn(`回答オプションが見つかりません: ${answerId}`);
        return;
      }

      // Add weights for each category
      Object.entries(option.weights).forEach(([category, weight]) => {
        const categoryIndex = this.getCategoryIndex(category);
        if (categoryIndex !== -1 && weight > 0) {
          categorySums[categoryIndex] += weight;
          categoryCounts[categoryIndex]++;
          console.log('重み計算:', {
            question: question.prompt,
            answer: option.text,
            category,
            weight,
            currentSum: categorySums[categoryIndex],
            currentCount: categoryCounts[categoryIndex]
          });
        }
      });
    });

    // Get maximum appearance count
    const maxCount = Math.max(...categoryCounts);

    // Calculate scores for each category
    for (let i = 0; i < vector.length; i++) {
      if (categoryCounts[i] > 0) {
        const averageScore = categorySums[i] / categoryCounts[i];
        const frequencyBonus = 2 * (categoryCounts[i] / maxCount);
        vector[i] = averageScore + frequencyBonus;
      } else {
        vector[i] = 0; // No weights appeared for this category
      }
    }

    // Normalize scores to 0-10 range
    const maxScore = Math.max(...vector);
    if (maxScore > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = (vector[i] / maxScore) * 10;
      }
    }

    console.log('最終的なユーザーベクトル:', vector);
    return vector;
  }

  private getCategoryIndex(category: string): number {
    const categoryMap: { [key: string]: number } = {
      workStyle: 0,
      organization: 1,
      growth: 2,
      values: 3,
      relationships: 4,
      customerContact: 5,
      businessStyle: 6,
      evaluation: 7,
      diversity: 8,
      stability: 9
    };
    return categoryMap[category] ?? -1;
  }

  isComplete(): boolean {
    return this.currentQuestionIndex >= this.questions.length;
  }

  getProgress(): number {
    return (this.currentQuestionIndex / this.questions.length) * 100;
  }

  getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  reset(): void {
    this.currentQuestionIndex = 0;
    this.answers.clear();
  }
} 