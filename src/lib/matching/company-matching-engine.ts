import { CompanyData, CompanyMatch } from '@/types';
import { CsvLoader } from '../utils/csv-loader';

export interface CompanyMatch {
  company: CompanyData;
  matchScore: number;
  matchReason: string;
}

export class CompanyMatchingEngine {
  private companies: CompanyData[] = [];
  private csvLoader: CsvLoader;

  constructor() {
    this.csvLoader = new CsvLoader();
  }

  async initialize(): Promise<void> {
    try {
      this.companies = await this.csvLoader.loadCompanies();
      console.log(`${this.companies.length}件の企業データを読み込みました`);
      
      // デバッグ: 読み込んだ企業データのサンプルを表示
      if (this.companies.length > 0) {
        console.log('企業データのサンプル:', {
          name: this.companies[0].name,
          workStyle: this.companies[0].workStyle,
          organization: this.companies[0].organization,
          growth: this.companies[0].growth,
          values: this.companies[0].values,
          relationships: this.companies[0].relationships,
          customerContact: this.companies[0].customerContact,
          businessStyle: this.companies[0].businessStyle,
          evaluation: this.companies[0].evaluation,
          diversity: this.companies[0].diversity,
          stability: this.companies[0].stability
        });
      }
    } catch (error) {
      console.error('企業データの読み込みエラー:', error);
      throw error;
    }
  }

  findMatchingCompanies(userVector: number[]): CompanyMatch[] {
    console.log('企業マッチング開始:', {
      userVector,
      totalCompanies: this.companies.length
    });

    const matches = this.companies
      .map(company => {
        const companyVector = this.getCompanyVector(company);
        console.log('企業ベクトル計算:', {
          companyName: company.name,
          companyVector,
          rawData: {
            workStyle: company.workStyle,
            organization: company.organization,
            growth: company.growth,
            values: company.values,
            relationships: company.relationships,
            customerContact: company.customerContact,
            businessStyle: company.businessStyle,
            evaluation: company.evaluation,
            diversity: company.diversity,
            stability: company.stability
          }
        });
        const matchScore = this.calculateMatchScore(userVector, companyVector);

        return {
          company,
          matchScore,
          matchReason: this.generateMatchReason(company, matchScore)
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    console.log('マッチング結果:', {
      totalMatches: matches.length,
      topMatches: matches.slice(0, 5).map(m => ({
        company: m.company.name,
        score: m.matchScore
      }))
    });

    return matches;
  }

  private getCompanyVector(company: CompanyData): number[] {
    // デバッグ: 企業データの生データを確認
    console.log('企業データの生データ:', {
      name: company.name,
      workStyle: company.workStyle,
      organization: company.organization,
      growth: company.growth,
      values: company.values,
      relationships: company.relationships,
      customerContact: company.customerContact,
      businessStyle: company.businessStyle,
      evaluation: company.evaluation,
      diversity: company.diversity,
      stability: company.stability
    });

    // 数値の変換を確実に行う
    const parseNumber = (value: number | undefined): number => {
      if (value === undefined) return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    const vector = [
      parseNumber(company.workStyle),
      parseNumber(company.organization),
      parseNumber(company.growth),
      parseNumber(company.values),
      parseNumber(company.relationships),
      parseNumber(company.customerContact),
      parseNumber(company.businessStyle),
      parseNumber(company.evaluation),
      parseNumber(company.diversity),
      parseNumber(company.stability)
    ];

    // デバッグ: 変換後のベクトルを確認
    console.log('変換後の企業ベクトル:', {
      name: company.name,
      vector
    });

    return vector;
  }

  private calculateMatchScore(userVector: number[], companyVector: number[]): number {
    // コサイン類似度の計算
    const dotProduct = userVector.reduce((sum, val, i) => sum + val * companyVector[i], 0);
    const userNorm = Math.sqrt(userVector.reduce((sum, val) => sum + val * val, 0));
    const companyNorm = Math.sqrt(companyVector.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (userNorm * companyNorm);
  }

  private generateMatchReason(company: CompanyData, matchScore: number): string {
    const points: string[] = [];
    
    // マッチングスコアに基づいてポイントを生成
    if (matchScore > 0.8) {
      points.push('あなたの価値観と企業の文化が非常に高い親和性を持っています');
      points.push('企業の成長性とあなたのキャリア目標が一致しています');
    } else if (matchScore > 0.6) {
      points.push('企業の働き方とあなたの希望が合致しています');
      points.push('企業の評価制度があなたの期待に沿っています');
    } else {
      points.push('企業の安定性があなたの求める条件と一致しています');
      points.push('企業の多様性があなたの価値観と合致しています');
    }

    return points.join('。');
  }

  reset(): void {
    // 必要に応じて初期状態にリセット
    this.isInitialized = false;
  }
} 