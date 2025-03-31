import { CsvLoader, CompanyData } from '../utils/csv-loader';
import { supabase } from '../supabase/client';
import { generateMatchExplanation } from '../supabase/edge-functions';

export interface MatchResult {
  company: CompanyData;
  matchScore: number;
  matchingCategories: string[];
  matchExplanation: string;
}

export class MatchingEngine {
  private csvLoader: CsvLoader;

  constructor() {
    this.csvLoader = new CsvLoader();
  }

  public async matchCompanies(userVector: { scores: number[]; categories: string[] }): Promise<MatchResult[]> {
    const companies = await this.csvLoader.loadCompanies();
    const results: MatchResult[] = [];

    for (const company of companies) {
      const matchScore = this.calculateMatchScore(userVector.scores, company.scores);
      const matchingCategories = this.findMatchingCategories(userVector, company);

      if (matchScore > 0.5) {
        const matchExplanation = await this.generateMatchExplanation(userVector, company, matchingCategories);
        results.push({
          company,
          matchScore,
          matchingCategories,
          matchExplanation,
        });
      }
    }

    // マッチングスコアで降順にソート
    results.sort((a, b) => b.matchScore - a.matchScore);

    // 結果を保存
    await this.saveMatchResults(userVector, results);

    return results;
  }

  private calculateMatchScore(userScores: number[], companyScores: number[]): number {
    let totalScore = 0;
    let maxScore = 0;

    for (let i = 0; i < userScores.length; i++) {
      const userScore = userScores[i];
      const companyScore = companyScores[i];
      const score = 1 - Math.abs(userScore - companyScore) / 4;
      totalScore += score;
      maxScore += 1;
    }

    return totalScore / maxScore;
  }

  private findMatchingCategories(userVector: { scores: number[]; categories: string[] }, company: CompanyData): string[] {
    const matchingCategories: string[] = [];

    for (let i = 0; i < userVector.scores.length; i++) {
      const userScore = userVector.scores[i];
      const companyScore = company.scores[i];
      const score = 1 - Math.abs(userScore - companyScore) / 4;

      if (score > 0.7) {
        matchingCategories.push(userVector.categories[i]);
      }
    }

    return matchingCategories;
  }

  private async generateMatchExplanation(
    userVector: { scores: number[]; categories: string[] },
    company: CompanyData,
    matchingCategories: string[]
  ): Promise<string> {
    try {
      const response = await generateMatchExplanation({
        userVector: {
          categories: userVector.categories,
          scores: userVector.scores,
        },
        company: {
          name: company.name,
          tags: company.tags,
        },
        matchingCategories,
      });

      return response.explanation;
    } catch (error) {
      console.error('マッチング説明の生成に失敗しました:', error);
      return 'マッチング説明の生成に失敗しました。';
    }
  }

  public async saveMatchResults(userVector: { scores: number[]; categories: string[] }, results: MatchResult[]): Promise<void> {
    const { error } = await supabase
      .from('match_results')
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        results: results.map(result => ({
          company_id: result.company.id,
          match_score: result.matchScore,
          matching_categories: result.matchingCategories,
          match_explanation: result.matchExplanation,
        })),
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
  }
} 