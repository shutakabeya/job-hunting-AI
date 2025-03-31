import { BaseAgent } from './BaseAgent';
import { Context, AgentResponse } from '@/types/agent';

export class PreparationAgent extends BaseAgent {
  initialize(): void {
    this.messageQueue = [];
  }

  async processMessage(message: string): Promise<AgentResponse> {
    return this.createResponse('就活準備機能は現在開発中です。');
  }

  protected async generateResponse(message: string): Promise<string> {
    return '就活準備機能は現在開発中です。';
  }

  protected async determineNextStep(message: string): Promise<string | undefined> {
    return undefined;
  }

  protected createInteractiveElements(): any[] {
    return [];
  }

  receiveData(data: any): void {
    console.log('Received data in PreparationAgent:', data);
  }
} 