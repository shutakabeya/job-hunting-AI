import { OpenAI } from 'openai';
import { CohereClient } from 'cohere-ai';
import { generateId } from '@/lib/utils';
import { Context, AgentMessage, AgentResponse } from '@/types/agent';

export interface AgentConfig {
  openaiApiKey?: string;
  cohereApiKey?: string;
}

export abstract class BaseAgent {
  protected openai?: OpenAI;
  protected cohere?: CohereClient;
  protected messageQueue: AgentMessage[] = [];
  protected context: Context;
  protected config?: AgentConfig;
  protected name: string;
  protected role: string;
  protected expertise: string;
  protected capabilities: string[];
  
  constructor(
    name: string,
    role: string,
    expertise: string,
    capabilities: string[],
    context: Context,
    config?: AgentConfig
  ) {
    console.log('Initializing BaseAgent...'); // デバッグ用
    this.name = name;
    this.role = role;
    this.expertise = expertise;
    this.capabilities = capabilities;
    this.context = context;
    this.config = config;

    const apiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      throw new Error('OpenAI APIキーが設定されていません');
    }

    try {
      this.openai = new OpenAI({ 
        apiKey,
        dangerouslyAllowBrowser: true
      });
      
      const cohereApiKey = config?.cohereApiKey || process.env.COHERE_API_KEY;
      if (cohereApiKey) {
        this.cohere = new CohereClient({ token: cohereApiKey });
      }
      console.log('BaseAgent initialized successfully'); // デバッグ用
    } catch (error) {
      console.error('Error initializing AI clients:', error);
      throw new Error('AIクライアントの初期化に失敗しました: ' + (error instanceof Error ? error.message : String(error)));
    }
    this.initialize();
  }

  initialize(): void {
    this.messageQueue = [];
  }

  setContext(context: Context): void {
    this.context = context;
  }

  async getPhaseData(): Promise<any> {
    return {
      messageQueue: this.messageQueue,
      context: this.context
    };
  }

  protected async generateWithOpenAI(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.openai) {
      console.error('OpenAI client is not initialized');
      throw new Error('OpenAI APIクライアントが初期化されていません');
    }
    
    try {
      console.log('Generating response with OpenAI...'); // デバッグ用
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      });

      if (!response.choices[0].message.content) {
        throw new Error('OpenAI APIからの応答が空です');
      }

      console.log('OpenAI response generated successfully'); // デバッグ用
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('OpenAI APIでエラーが発生しました: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  protected async searchWithCohere(query: string, documents: string[]): Promise<number[]> {
    if (!this.cohere) throw new Error('Cohere API key not configured');
    
    const response = await this.cohere.embed({
      texts: [query],
      model: 'embed-multilingual-v3.0'
    });

    // ここでベクトル検索のロジックを実装
    // 実際の実装では、proper vector similarity searchを使用する
    return []; // プレースホルダー
  }

  public abstract processMessage(message: string): Promise<AgentResponse>;

  protected createMessage(role: 'user' | 'assistant', content: string): AgentMessage {
    return {
      id: generateId(),
      role,
      content,
      timestamp: Date.now()
    };
  }

  protected addMessage(message: AgentMessage): void {
    this.messageQueue.push(message);
  }

  public getMessages(): AgentMessage[] {
    return this.messageQueue;
  }

  public getContext(): Context {
    return this.context;
  }

  public setContext(context: Partial<Context>): void {
    this.context = { ...this.context, ...context };
  }

  protected abstract generateResponse(message: string): Promise<string>;
  
  protected abstract determineNextStep(message: string): Promise<string | undefined>;
  
  protected abstract createInteractiveElements(): any[];

  abstract receiveData(data: any): void;

  protected async sendMessage(to: string, type: string, payload: any): Promise<void> {
    const message: AgentMessage = {
      type: type as any,
      from: this.constructor.name,
      to,
      payload,
      metadata: {
        timestamp: Date.now(),
        priority: 1,
        context: this.context
      }
    };
    
    await this.messageQueue.push(message);
  }

  protected createResponse(message: string, contextUpdate?: Partial<Context>): AgentResponse {
    const response: AgentResponse = {
      message,
      context: {
        ...this.context,
        ...contextUpdate
      }
    };

    return response;
  }

  protected updateContext(update: Partial<Context>): void {
    this.context = {
      ...this.context,
      ...update
    };
  }
} 