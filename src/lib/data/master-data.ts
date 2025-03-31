import { CsvLoader } from '../utils/csv-loader';
import { Company, CompanyMatch, CompanyProgress } from '@/types/company';

export class MasterDataService {
  private static instance: MasterDataService;
  private csvLoader: CsvLoader;
  private companies: Company[] = [];

  private constructor() {
    this.csvLoader = new CsvLoader();
  }

  public static getInstance(): MasterDataService {
    if (!MasterDataService.instance) {
      MasterDataService.instance = new MasterDataService();
    }
    return MasterDataService.instance;
  }

  public async getCompanyData(companyId: string): Promise<Company | null> {
    try {
      if (this.companies.length === 0) {
        this.companies = await this.csvLoader.loadCompanies();
      }

      // URLデコードを行い、企業名を比較
      const decodedCompanyId = decodeURIComponent(companyId);
      console.log('企業データ検索:', {
        originalId: companyId,
        decodedId: decodedCompanyId,
        availableCompanies: this.companies.map(c => c.name)
      });

      const company = this.companies.find(company => company.name === decodedCompanyId);
      if (!company) {
        console.error(`企業データが見つかりません: ${decodedCompanyId}`);
        return null;
      }
      return company;
    } catch (error) {
      console.error('企業データの取得に失敗しました:', error);
      return null;
    }
  }

  public async getCompanyTodos(companyName: string) {
    try {
      const todos = await this.csvLoader.loadTodos();
      return todos.filter(todo => 
        todo.text.toLowerCase().includes(companyName.toLowerCase())
      );
    } catch (error) {
      console.error('ToDoデータの取得に失敗しました:', error);
      return [];
    }
  }

  public async getCompanyProgress(companyId: string, userId: string): Promise<CompanyProgress | null> {
    try {
      // 進捗データは現在実装していないため、空のデータを返す
      return {
        companyId,
        userId,
        completedSteps: [],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('進捗データの取得に失敗しました:', error);
      return null;
    }
  }

  public async updateCompanyProgress(progress: CompanyProgress): Promise<void> {
    try {
      // 進捗データの更新は現在実装していないため、何もしない
      console.log('進捗データの更新:', progress);
    } catch (error) {
      console.error('進捗データの更新に失敗しました:', error);
      throw error;
    }
  }
} 