import AppLayout from '@/components/AppLayout';
import Card from '@/components/Card';
import PageTransition from '@/components/PageTransition';

// アイコンコンポーネント
const StrengthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-5"></path>
    <path d="M9 8V2"></path>
    <path d="M15 8V2"></path>
    <path d="M12 8v8"></path>
    <path d="M19 8a7 7 0 1 0-14 0"></path>
  </svg>
);

const ValueIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
);

const SkillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
    <path d="M12 2v2"></path>
    <path d="M12 22v-2"></path>
    <path d="m17 20.66-1-1.73"></path>
    <path d="M11 10.27 7 3.34"></path>
    <path d="m20.66 17-1.73-1"></path>
    <path d="m3.34 7 1.73 1"></path>
    <path d="M14 12h8"></path>
    <path d="M2 12h2"></path>
    <path d="m20.66 7-1.73 1"></path>
    <path d="m3.34 17 1.73-1"></path>
    <path d="m17 3.34-1 1.73"></path>
    <path d="m7 20.66 1-1.73"></path>
  </svg>
);

export default function AnalysisPage() {
  return (
    <PageTransition>
      <AppLayout title="自己分析">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            title="あなたの強み" 
            icon={StrengthIcon}
            delay={0}
            className="col-span-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">論理的思考力</span>
                <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">コミュニケーション</span>
                <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">リーダーシップ</span>
                <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">創造性</span>
                <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              詳細を見る
            </button>
          </Card>
          
          <Card 
            title="あなたの価値観" 
            icon={ValueIcon}
            delay={1}
            className="col-span-1"
          >
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                成長志向
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                チームワーク
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                挑戦
              </span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                創造性
              </span>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">
                自律性
              </span>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              詳細を見る
            </button>
          </Card>
          
          <Card 
            title="あなたのスキル" 
            icon={SkillIcon}
            delay={2}
            className="col-span-1 md:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ハードスキル</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">プログラミング</span>
                    <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">データ分析</span>
                    <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">マーケティング</span>
                    <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ソフトスキル</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">チームワーク</span>
                    <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">コミュニケーション</span>
                    <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">問題解決能力</span>
                    <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              スキル分析を更新
            </button>
          </Card>
        </div>
      </AppLayout>
    </PageTransition>
  );
} 