export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  timestamp?: number;
}

export interface InteractiveElement {
  id: string;
  type: 'button' | 'select' | 'input' | 'progress' | 'chart' | 'card';
  label?: string;
  value?: string | number;
  options?: Array<{
    value: string;
    label: string;
  }>;
  data?: any;
  action?: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  interactive?: InteractiveElement[];
  timestamp?: number;
}

export interface ChatContext {
  phase: 'initial' | 'self_analysis' | 'company_matching' | 'preparation';
  topic?: string;
  lastMessageId?: string;
  interactionHistory?: string[];
}

export interface ChatState {
  messages: ChatMessage[];
  context: ChatContext;
  isLoading: boolean;
  error?: string;
} 