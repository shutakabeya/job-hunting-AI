import { create } from 'zustand';

// 質問データ
const questions = [
  {
    id: 1,
    type: 'text',
    question: 'あなたが大切にしていることは何ですか？',
    description: '仕事や生活において、あなたが最も重視する価値観を教えてください。',
  },
  {
    id: 2,
    type: 'choice',
    question: '仕事において、どのような環境が理想的ですか？',
    description: '最も自分に合っていると思う働き方を選んでください。',
    choices: [
      { id: 'a', text: '自由に創造的な仕事ができる環境' },
      { id: 'b', text: '安定していて将来が見通せる環境' },
      { id: 'c', text: '常に新しい挑戦ができる環境' },
      { id: 'd', text: 'チームで協力して成果を出せる環境' },
    ],
  },
  {
    id: 3,
    type: 'swipe',
    question: '以下の項目はあなたに当てはまりますか？',
    statements: [
      { id: 's1', text: '新しいことに挑戦するのが好きだ' },
      { id: 's2', text: '計画を立ててから行動するタイプだ' },
      { id: 's3', text: '人と話すことでエネルギーを得る' },
      { id: 's4', text: '細部まで完璧にこだわりたい' },
      { id: 's5', text: '直感で判断することが多い' },
    ],
  },
  {
    id: 4,
    type: 'scale',
    question: '以下の項目について、あなたにどの程度当てはまるか評価してください',
    description: '1（全く当てはまらない）〜5（非常に当てはまる）で評価してください',
    items: [
      { id: 'i1', text: '論理的に考えることが得意だ' },
      { id: 'i2', text: '他者の感情に共感できる' },
      { id: 'i3', text: '目標に向かって粘り強く取り組める' },
      { id: 'i4', text: '複数の視点から物事を考えられる' },
    ],
  },
  {
    id: 5,
    type: 'text',
    question: 'あなたの強みは何だと思いますか？',
    description: '自分自身で認識している強みを教えてください。',
  },
];

// 企業環境の推奨データ（実際のアプリではAPIから取得するなど）
const recommendedEnvironments = [
  {
    id: 'env1',
    title: 'クリエイティブ志向の環境',
    description: '自由な発想と創造性を重視する企業文化。新しいアイデアを歓迎し、革新的なプロジェクトに取り組める環境です。',
    matchingPoints: ['創造性', '自由度', '革新性'],
    examples: ['デザイン会社', 'スタートアップ', 'メディア企業'],
  },
  {
    id: 'env2',
    title: '安定志向の環境',
    description: '長期的なキャリア形成と安定を重視する企業文化。計画的に業務を進め、着実な成長を目指せる環境です。',
    matchingPoints: ['安定性', '計画性', '長期的視点'],
    examples: ['大手企業', '公務員', '金融機関'],
  },
  {
    id: 'env3',
    title: 'チーム協働の環境',
    description: 'チームワークと協力を重視する企業文化。多様な人々と協力しながら、共通の目標に向かって取り組める環境です。',
    matchingPoints: ['協調性', 'コミュニケーション', '多様性'],
    examples: ['コンサルティング会社', 'プロジェクトベースの組織', 'サービス業'],
  },
  {
    id: 'env4',
    title: '挑戦志向の環境',
    description: '常に新しい挑戦と成長を重視する企業文化。高い目標に向かって挑戦し続けることができる環境です。',
    matchingPoints: ['挑戦', '成長', '変化'],
    examples: ['ベンチャー企業', 'グローバル企業', 'テック企業'],
  },
];

const useAnalysisStore = create((set, get) => ({
  // 状態
  currentQuestionIndex: 0,
  answers: {},
  isCompleted: false,
  recommendedEnvironment: null,
  
  // 質問データ
  questions,
  
  // 推奨環境データ
  recommendedEnvironments,
  
  // アクション
  setAnswer: (questionId, answer) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    }));
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      // 最後の質問に回答した場合
      set({ isCompleted: true });
      get().analyzeAnswers();
    }
  },
  
  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },
  
  getCurrentQuestion: () => {
    const { currentQuestionIndex } = get();
    return questions[currentQuestionIndex];
  },
  
  // 回答を分析して適切な環境を推奨する
  analyzeAnswers: () => {
    const { answers, recommendedEnvironments } = get();
    
    // 実際のアプリでは、より複雑なアルゴリズムで分析する
    // ここでは簡易的な実装
    
    // 回答から特性を抽出（実際はもっと複雑な分析が必要）
    let traits = {
      creative: 0,
      stable: 0,
      teamwork: 0,
      challenge: 0,
    };
    
    // 質問2の選択肢に基づいて特性を加算
    if (answers[2] === 'a') traits.creative += 2;
    if (answers[2] === 'b') traits.stable += 2;
    if (answers[2] === 'c') traits.challenge += 2;
    if (answers[2] === 'd') traits.teamwork += 2;
    
    // 質問3のスワイプ回答に基づいて特性を加算
    const swipeAnswers = answers[3] || {};
    if (swipeAnswers.s1 === 'yes') traits.challenge += 1;
    if (swipeAnswers.s2 === 'yes') traits.stable += 1;
    if (swipeAnswers.s3 === 'yes') traits.teamwork += 1;
    if (swipeAnswers.s4 === 'yes') traits.stable += 1;
    if (swipeAnswers.s5 === 'yes') traits.creative += 1;
    
    // 最も高いスコアの特性を見つける
    const maxTrait = Object.entries(traits).reduce(
      (max, [trait, score]) => (score > max.score ? { trait, score } : max),
      { trait: '', score: -1 }
    );
    
    // 特性に基づいて環境を推奨
    let recommendedEnv;
    switch (maxTrait.trait) {
      case 'creative':
        recommendedEnv = recommendedEnvironments.find(env => env.id === 'env1');
        break;
      case 'stable':
        recommendedEnv = recommendedEnvironments.find(env => env.id === 'env2');
        break;
      case 'teamwork':
        recommendedEnv = recommendedEnvironments.find(env => env.id === 'env3');
        break;
      case 'challenge':
        recommendedEnv = recommendedEnvironments.find(env => env.id === 'env4');
        break;
      default:
        recommendedEnv = recommendedEnvironments[0];
    }
    
    set({ recommendedEnvironment: recommendedEnv });
  },
  
  // 分析をリセットして最初からやり直す
  resetAnalysis: () => {
    set({
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      recommendedEnvironment: null,
    });
  },
}));

export default useAnalysisStore; 