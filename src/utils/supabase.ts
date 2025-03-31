import { createClient } from '@supabase/supabase-js';

// Supabaseの設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

// インターフェースの定義
export interface ChatMessage {
  id?: string;
  user_id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp?: string;
  context?: {
    currentStep?: 'self_analysis' | 'company_matching' | 'task_management';
    metadata?: Record<string, any>;
  };
}

// メッセージの保存
export async function saveChatMessage(message: ChatMessage): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: message.user_id || 'anonymous',
        content: message.content,
        type: message.type,
        timestamp: new Date().toISOString(),
        context: message.context || {}
      }]);

    if (error) {
      console.error('メッセージの保存エラー:', error);
      throw error;
    }
  } catch (error) {
    console.error('チャットメッセージの保存に失敗しました:', error);
    throw error;
  }
}

// チャット履歴の取得
export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('履歴取得エラー:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('チャット履歴の取得に失敗しました:', error);
    return [];
  }
} 