import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types';
import { SelfAnalysisEngine } from '@/lib/self-analysis/self-analysis-engine';
import { CompanyMatchingEngine, CompanyMatch } from '@/lib/matching/company-matching-engine';
import { CsvLoader } from '@/lib/utils/csv-loader';

export function useJobHunting() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<any>(null);
  const [selfAnalysisEngine] = useState(() => new SelfAnalysisEngine());
  const [companyMatchingEngine] = useState(() => new CompanyMatchingEngine());
  const [isInitialQuestionAnswered, setIsInitialQuestionAnswered] = useState(false);
  const [matchingResults, setMatchingResults] = useState<CompanyMatch[]>([]);
  const [displayedCompaniesCount, setDisplayedCompaniesCount] = useState(10);
  const [showMoreButton, setShowMoreButton] = useState(false);

  // 初期化時に言語化の質問を表示
  useEffect(() => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'あなたが最も重視している企業の要素について、なるべく詳しく言語化して教えてください。'
    };
    setMessages([initialMessage]);
  }, []);

  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 自己分析エンジンの初期化
      await selfAnalysisEngine.initialize();
      console.log('自己分析エンジンの初期化が完了しました');

      // 企業マッチングエンジンの初期化
      await companyMatchingEngine.initialize();
      console.log('企業マッチングエンジンの初期化が完了しました');

      // 言語化の質問を表示
      setMessages([
        {
          id: 'initial',
          role: 'assistant',
          content: 'あなたが最も重視している企業の要素について、なるべく詳しく言語化して教えてください。'
        }
      ]);
    } catch (error) {
      console.error('初期化エラー:', error);
      setError(error instanceof Error ? error.message : '初期化に失敗しました。ページを更新して再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [selfAnalysisEngine, companyMatchingEngine]);

  const showNextQuestion = useCallback(() => {
    if (!selfAnalysisEngine) return;

    const currentQuestion = selfAnalysisEngine.getCurrentQuestion();
    if (!currentQuestion) return;

    const categoryNames = [
      'ワークスタイル', '組織文化', '成長機会', '価値観', '人間関係',
      '顧客接点', 'ビジネススタイル', '評価制度', '多様性', '安定性'
    ];

    const userVector = selfAnalysisEngine.calculateUserVector();
    const vectorOutput = userVector.map((score, index) => 
      `${categoryNames[index]}: ${score.toFixed(1)}/10`
    ).join('\n');

    setMessages(prev => [
      ...prev,
      {
        id: `question-${currentQuestion.id}`,
        role: 'assistant',
        content: `あなたの回答から、以下のような特徴が見られます：\n\n${vectorOutput}\n\n次の質問に答えてください：\n\n${currentQuestion.prompt}`,
        interactiveElements: currentQuestion.options.map(option => ({
          id: option.id,
          text: option.text
        }))
      }
    ]);
  }, [selfAnalysisEngine]);

  const sendMessage = useCallback(async (content: string, role: 'user' | 'assistant' | 'system' = 'user') => {
    try {
      setIsLoading(true);
      setError(null);

      const newMessage: Message = {
        id: Date.now().toString(),
        role,
        content
      };

      setMessages(prev => [...prev, newMessage]);

      if (role === 'user') {
        if (!isInitialQuestionAnswered) {
          // 言語化の質問に答えた後は自己分析エンジンの質問を開始
          setIsInitialQuestionAnswered(true);
          showNextQuestion();
        }
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      setError('メッセージの送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialQuestionAnswered, showNextQuestion]);

  const handleShowMore = useCallback(() => {
    console.log('handleShowMore called:', { currentCount: displayedCompaniesCount, totalCompanies: matchingResults.length });
    
    // 表示企業数を更新
    setDisplayedCompaniesCount(prev => {
      const newCount = prev + 10;
      console.log('表示企業数を更新:', { prev, newCount, totalCompanies: matchingResults.length });
      return newCount;
    });

    // 表示企業数を更新した後、メッセージを更新
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.component === 'CompanyGrid') {
        const newDisplayedCount = displayedCompaniesCount + 10;
        const hasMoreCompanies = newDisplayedCount < matchingResults.length;
        console.log('メッセージ更新:', { newDisplayedCount, hasMoreCompanies, totalCompanies: matchingResults.length });
        
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            componentProps: {
              ...lastMessage.componentProps,
              displayedCount: newDisplayedCount,
              showMoreButton: hasMoreCompanies,
              companies: matchingResults
            }
          }
        ];
      }
      return prev;
    });
  }, [matchingResults, displayedCompaniesCount]);

  const handleInteraction = async (message: string) => {
    try {
      if (!selfAnalysisEngine) {
        throw new Error('自己分析エンジンが初期化されていません');
      }

      console.log('handleInteraction called with:', message);
      console.log('現在の質問:', selfAnalysisEngine.getCurrentQuestion());

      // ユーザーの回答を保存
      selfAnalysisEngine.submitAnswer(message);
      console.log('回答を保存しました');

      // 次の質問を表示
      showNextQuestion();

      // 自己分析が完了した場合
      if (selfAnalysisEngine.isComplete()) {
        console.log('自己分析が完了しました');
        const userVector = selfAnalysisEngine.calculateUserVector();
        console.log('ユーザーベクトル:', userVector);

        // 企業マッチングを実行
        try {
          const matches = companyMatchingEngine.findMatchingCompanies(userVector);
          console.log('マッチング結果:', matches);

          // 表示企業数を10に設定
          setDisplayedCompaniesCount(10);
          setMatchingResults(matches);
          setShowMoreButton(matches.length > 10);

          // マッチング結果を表示
          setMessages(prev => [
            ...prev,
            {
              id: 'matching-results',
              role: 'assistant',
              content: `自己分析が完了しました。あなたの特徴に合う企業を${matches.length}社見つけました。`,
              component: 'CompanyGrid',
              componentProps: {
                companies: matches,
                displayedCount: 10,
                showMoreButton: matches.length > 10,
                onShowMore: handleShowMore
              }
            }
          ]);
        } catch (error) {
          console.error('企業マッチングエラー:', error);
          setMessages(prev => [
            ...prev,
            {
              id: 'matching-error',
              role: 'assistant',
              content: '申し訳ありません。企業のマッチング中にエラーが発生しました。'
            }
          ]);
        }
      }
    } catch (error) {
      console.error('インタラクション処理中にエラーが発生しました:', error);
      setMessages(prev => [
        ...prev,
        {
          id: 'interaction-error',
          role: 'assistant',
          content: 'エラーが発生しました。もう一度お試しください。'
        }
      ]);
    }
  };

  return {
    messages,
    isLoading,
    error,
    context,
    matchingResults,
    sendMessage,
    handleInteraction,
    initializeChat
  };
} 