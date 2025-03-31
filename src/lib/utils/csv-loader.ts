import { parse } from 'csv-parse/sync';

export interface SelfAnalysisData {
  questions: Array<{
    id: string;
    prompt: string;
    options: Array<{
      id: string;
      text: string;
      weights: Record<string, number>;
    }>;
  }>;
}

export interface CompanyData {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  businessDetails: string[];
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
  workStyleTags: string[];
  organizationTags: string[];
  growthTags: string[];
  valuesTags: string[];
  relationshipsTags: string[];
  customerContactTags: string[];
  businessStyleTags: string[];
  evaluationTags: string[];
  diversityTags: string[];
  stabilityTags: string[];
  steps: string[];
  interviewFocus: string;
  deadlines?: string[];
  commonQuestions?: string[];
  website: string;
}

export interface TodoData {
  id: string;
  text: string;
  completed: boolean;
  steps: string[];
}

export class CsvLoader {
  private async fetchCsv(path: string): Promise<string> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`CSVファイルの読み込みに失敗しました: ${response.statusText}`);
    }
    return response.text();
  }

  async loadSelfAnalysisData(): Promise<SelfAnalysisData> {
    try {
      const csvText = await this.fetchCsv('/data/就活AI_自己理解設問構造化_修正版.csv');
      const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true
      });

      // 設問ごとにデータをグループ化
      const questionsMap = new Map<string, SelfAnalysisData>();

      records.forEach((record: any) => {
        const questionId = record['設問番号'];
        const optionId = record['選択肢'].charAt(0).toLowerCase(); // A, B, C, Dからa, b, c, dに変換

        // 数値の変換を確実に行う
        const parseNumber = (value: string | undefined): number => {
          if (!value) return 0;
          const num = Number(value);
          return isNaN(num) ? 0 : num;
        };

        // 選択肢の重みを取得
        const weights = {
          workStyle: parseNumber(record['働き方・裁量']),
          organization: parseNumber(record['組織の風土']),
          growth: parseNumber(record['成長と挑戦']),
          values: parseNumber(record['価値観・共鳴性']),
          relationships: parseNumber(record['人間関係']),
          customerContact: parseNumber(record['顧客接点']),
          businessStyle: parseNumber(record['業務スタイル']),
          evaluation: parseNumber(record['評価軸・報酬']),
          diversity: parseNumber(record['多様性・自分らしさ']),
          stability: parseNumber(record['変化と安定'])
        };

        // 設問が存在しない場合は新規作成
        if (!questionsMap.has(questionId)) {
          questionsMap.set(questionId, {
            id: questionId,
            prompt: record['設問内容'],
            options: []
          });
        }

        // 選択肢を追加
        const question = questionsMap.get(questionId)!;
        question.options.push({
          id: optionId,
          text: record['選択肢'],
          weights
        });
      });

      // Mapから配列に変換
      const questions = Array.from(questionsMap.values());

      // デバッグ: 変換後のデータを確認
      console.log('変換後の自己分析データ:', {
        totalQuestions: questions.length,
        sampleQuestion: questions[0]
      });

      return { questions };
    } catch (error) {
      console.error('自己分析データの読み込みに失敗しました:', error);
      throw error;
    }
  }

  async loadCompanies(): Promise<CompanyData[]> {
    try {
      const csvText = await this.fetchCsv('/data/マスターデータ.csv');
      const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true
      });

      // デバッグ: CSVの生データを確認
      console.log('企業データCSVの最初の数行:', records.slice(0, 5));
      console.log('CSVのカラム名:', Object.keys(records[0]));

      if (records.length === 0) {
        throw new Error('企業データが空です');
      }

      const companies = records.map((record: any) => {
        // 数値の変換を確実に行う
        const parseNumber = (value: string | undefined): number => {
          if (!value) return 0;
          const num = Number(value);
          return isNaN(num) ? 0 : num;
        };

        // タグデータの処理
        const parseTags = (value: string | undefined): string[] => {
          if (!value) return [];
          try {
            // 文字列から配列を抽出
            const matches = value.match(/\[(.*?)\]/);
            if (!matches) return [];
            // カンマで分割し、各要素から余分な文字を削除
            return matches[1]
              .split(',')
              .map(tag => tag.trim().replace(/['"]/g, ''))
              .filter(Boolean);
          } catch (error) {
            console.error('タグデータの解析エラー:', error);
            return [];
          }
        };

        return {
          id: record['企業名'] || '', // 企業名をIDとして使用
          name: record['企業名'] || '',
          industry: record['業界カテゴリ'] || '',
          size: record['企業規模'] || '',
          description: record['企業プロフィール'] || '',
          businessDetails: record['事業内容'] ? record['事業内容'].split(',').filter(Boolean) : [],
          workStyle: parseNumber(record['働き方と裁量']),
          organization: parseNumber(record['組織文化']),
          growth: parseNumber(record['成長と挑戦']),
          values: parseNumber(record['価値観共鳴']),
          relationships: parseNumber(record['人間関係']),
          customerContact: parseNumber(record['顧客との接点']),
          businessStyle: parseNumber(record['業務スタイル']),
          evaluation: parseNumber(record['評価と報酬']),
          diversity: parseNumber(record['多様性と自分らしさ']),
          stability: parseNumber(record['安定と変化']),
          workStyleTags: parseTags(record['働き方と裁量（タグ）']),
          organizationTags: parseTags(record['組織文化（タグ）']),
          growthTags: parseTags(record['成長と挑戦（タグ）']),
          valuesTags: parseTags(record['価値観共鳴（タグ）']),
          relationshipsTags: parseTags(record['人間関係（タグ）']),
          customerContactTags: parseTags(record['顧客との接点（タグ）']),
          businessStyleTags: parseTags(record['業務スタイル（タグ）']),
          evaluationTags: parseTags(record['評価と報酬（タグ）']),
          diversityTags: parseTags(record['多様性と自分らしさ（タグ）']),
          stabilityTags: parseTags(record['安定と変化（タグ）']),
          steps: [
            record['Step1'],
            record['Step2'],
            record['Step3'],
            record['Step4'],
            record['Step5'],
            record['Step6']
          ].filter(step => step && step.trim() !== ''),
          interviewFocus: record['特徴・傾向（面接で重視されること等）'] || '',
          deadlines: record['締切・スケジュール'] ? record['締切・スケジュール'].split(',').filter(Boolean) : undefined,
          commonQuestions: record['例年の質問'] ? record['例年の質問'].split(',').filter(Boolean) : undefined,
          website: record['企業Webサイト'] || undefined
        };
      });

      // デバッグ: 変換後のデータを確認
      console.log('変換後の企業データ:', {
        totalCompanies: companies.length,
        sampleCompany: companies[0]
      });

      return companies;
    } catch (error) {
      console.error('企業データの読み込みに失敗しました:', error);
      throw error;
    }
  }

  async loadTodos(): Promise<TodoData[]> {
    try {
      const csvText = await this.fetchCsv('/data/マスターデータ.csv');
      const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true
      });

      if (records.length === 0) {
        throw new Error('ToDoデータが空です');
      }

      return records.map((record: any) => ({
        id: record['企業名'] || '', // 企業名をIDとして使用
        text: record['企業名'] || '', // 企業名をテキストとして使用
        completed: false, // デフォルトは未完了
        steps: [
          record['Step1'],
          record['Step2'],
          record['Step3'],
          record['Step4'],
          record['Step5'],
          record['Step6']
        ].filter(step => step && step.trim() !== '')
      }));
    } catch (error) {
      console.error('ToDoデータの読み込みエラー:', error);
      return [];
    }
  }
} 