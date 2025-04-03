import OpenAI from 'openai';
import { CompanyData } from '../utils/csv-loader';
import { UserVector } from '../self-analysis/self-analysis-engine';

export interface FeedbackResult {
  matchExplanation: string;
  strengths: string[];
  areasForImprovement: string[];
}

export class FeedbackEngine {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public async generateFeedback(
    userVector: UserVector,
    company: CompanyData,
    matchingCategories: string[]
  ): Promise<FeedbackResult> {
    const prompt = this.generatePrompt(userVector, company, matchingCategories);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "あなたは就活アドバイザーです。ユーザーと企業のマッチングについて、具体的で建設的なフィードバックを提供してください。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message.content;
      return this.parseResponse(response || '');
    } catch (error) {
      console.error('Error generating feedback:', error);
      throw new Error('フィードバックの生成に失敗しました');
    }
  }

  private generatePrompt(
    userVector: UserVector,
    company: CompanyData,
    matchingCategories: string[]
  ): string {
    return `
以下の情報に基づいて、ユーザーと${company.name}のマッチングについてフィードバックを生成してください：

ユーザーの特徴：
${userVector.categories.map((category, index) => 
  `${category}: ${userVector.scores[index]}`
).join('\n')}

マッチングしているカテゴリ：
${matchingCategories.join(', ')}

企業の特徴：
${company.tags.join(', ')}

以下の形式で回答してください：
1. マッチングの理由（2-3文）
2. ユーザーの強み（箇条書き）
3. 改善点（箇条書き）
`;
  }

  private parseResponse(response: string): FeedbackResult {
    // レスポンスを解析して構造化データに変換
    const sections = response.split('\n\n');
    
    return {
      matchExplanation: sections[0] || '',
      strengths: sections[1]?.split('\n').filter(line => line.trim()) || [],
      areasForImprovement: sections[2]?.split('\n').filter(line => line.trim()) || [],
    };
  }
} 