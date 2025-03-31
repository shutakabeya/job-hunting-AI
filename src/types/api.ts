// 共通のレスポンス型
export interface APIResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// 自己分析の回答型
export interface AnalysisResponse {
  message: string;
}

// 自己分析結果の型
export interface AnalysisResult {
  values: string[];
  strengths: string[];
  preferences: string[];
  summary: string;
}

// チャットメッセージの型
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// チャットレスポンスの型
export interface ChatResponse {
  message: string;
}

// エラーレスポンスの型
export interface ErrorResponse {
  error: string;
  code: string;
}

// 自己分析の質問カテゴリー
export type AnalysisCategory = '価値観' | '強み' | '興味';

// 自己分析の質問型
export interface AnalysisQuestion {
  category: AnalysisCategory;
  questions: string[];
}

// 自己分析の回答データ型
export interface AnalysisAnswers {
  [category: string]: string[];
} 