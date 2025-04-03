'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MasterDataService } from '@/lib/data/master-data';
import { CompanyData } from '@/types/company';
import { Building2, Briefcase, Calendar, MessageSquare, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { DefaultCompanyStrategy } from '@/lib/strategies/company-strategy';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [strategy, setStrategy] = useState<string>('');

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const masterDataService = MasterDataService.getInstance();
        const companyData = await masterDataService.getCompanyData(companyId);
        if (!companyData) throw new Error('企業データが見つかりません');

        // 進捗データの取得
        const progressData = await masterDataService.getCompanyProgress(companyId, 'user123'); // TODO: 実際のユーザーIDを使用
        if (progressData) {
          setCompletedSteps(progressData.completedSteps);
          setProgress((progressData.completedSteps.length / companyData.steps.length) * 100);
        }

        setCompany(companyData);
        
        // 企業戦略の取得
        const strategyInstance = new DefaultCompanyStrategy();
        const companyStrategy = strategyInstance.getStrategy(companyData);
        setStrategy(companyStrategy);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (!company) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <Button
              variant="ghost"
              className="mb-6 sticky top-0 bg-gray-50 z-10"
              onClick={() => router.push('/companies')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              企業一覧に戻る
            </Button>

            {/* ヘッダー部分 */}
            <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm sticky top-12 z-10">
              <div>
                <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {company.industry}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {company.size}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">進捗状況</div>
                <Progress value={progress} className="w-32" />
                <div className="text-sm text-gray-500 mt-1">
                  {completedSteps.length}/{company.steps.length} ステップ完了
                </div>
              </div>
            </div>

            {/* 企業プロフィール */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">企業プロフィール</h2>
              <p className="text-gray-600">{company.description}</p>
            </Card>

            {/* 事業内容 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">事業内容</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {company.businessDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </Card>

            {/* 選考ステップ */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">選考ステップ</h2>
              <div className="space-y-4">
                {company.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      completedSteps.includes(index) ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {completedSteps.includes(index) ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{step}</div>
                      {company.deadlines?.[index] && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {company.deadlines[index]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 面接情報 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">面接情報</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">重視されるポイント</h3>
                  <p className="text-gray-600">{company.interviewFocus}</p>
                </div>
                {company.commonQuestions && company.commonQuestions.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">例年の質問</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {company.commonQuestions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {company.website && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">企業Webサイト</h2>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  企業Webサイト
                </a>
              </Card>
            )}

            <div className="flex justify-between items-center sticky bottom-0 bg-gray-50 py-4 z-10">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  {company.industry}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {company.size}
                </Badge>
              </div>
              <Button
                onClick={() => router.push(`/preparation/${companyId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                対策に進む
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 