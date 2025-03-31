'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { ChatContext, ChatMessage } from '@/types/chat';
import { InteractiveElement } from '@/components/interactive/InteractiveElement';
import { SelfAnalysisEngine } from '@/lib/self-analysis/self-analysis-engine';
import { CompanyMatchingEngine } from '@/lib/matching/company-matching-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { Company } from '@/types/company';
import { CompanyMatch, CompanyData } from '@/types';

interface ChatInterfaceProps {
  initialContext?: ChatContext | null;
  messages?: ChatMessage[];
  onSend?: (message: string) => void;
  isLoading?: boolean;
  onAnswer?: (answer: string) => void;
}

export function ChatInterface({
  initialContext,
  messages: initialMessages = [],
  onSend,
  isLoading = false,
  onAnswer
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ChatContext | null>(initialContext || null);
  const [isJobHuntingLoading, setIsJobHuntingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selfAnalysisEngine] = useState(() => new SelfAnalysisEngine());
  const [companyMatchingEngine] = useState(() => new CompanyMatchingEngine());
  const [isInitialQuestionAnswered, setIsInitialQuestionAnswered] = useState(false);
  const [matchingResults, setMatchingResults] = useState<Array<CompanyData & { matchScore: number; matchReason: string }>>([]);
  const [displayedCompaniesCount, setDisplayedCompaniesCount] = useState(10);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const hasSetInitialMessages = useRef(false);

  useEffect(() => {
    setContext(initialContext || null);
  }, [initialContext]);

  // messagesRefの更新
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // initialMessagesの設定（1回だけ）
  useEffect(() => {
    if (!hasSetInitialMessages.current && initialMessages.length > 0) {
      setMessages(initialMessages);
      hasSetInitialMessages.current = true;
    }
  }, [initialMessages]);

  // 初期化処理を1回だけ実行
  useEffect(() => {
    if (isInitializedRef.current) return;

    const initializeChat = async () => {
      try {
        setIsJobHuntingLoading(true);
        setError(null);

        // 自己分析エンジンの初期化
        await selfAnalysisEngine.initialize();
        console.log('自己分析エンジンの初期化が完了しました');

        // 企業マッチングエンジンの初期化
        await companyMatchingEngine.initialize();
        console.log('企業マッチングエンジンの初期化が完了しました');

        // 初期メッセージを設定
        if (messages.length === 0) {
          const initialMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'あなたが最も重視している企業の要素について、なるべく詳しく言語化して教えてください。'
          };
          setMessages([initialMessage]);
        }
        isInitializedRef.current = true;
      } catch (error) {
        console.error('初期化エラー:', error);
        setError(error instanceof Error ? error.message : '初期化に失敗しました。ページを更新して再度お試しください。');
      } finally {
        setIsJobHuntingLoading(false);
      }
    };

    initializeChat();
  }, []);

  const showNextQuestion = useCallback(() => {
    if (!selfAnalysisEngine) return;

    const currentQuestion = selfAnalysisEngine.getCurrentQuestion();
    if (!currentQuestion) return;

    // すでにこの質問を出していたら return
    const alreadyAsked = messagesRef.current.some(
      (msg) => msg.id === `question-${currentQuestion.id}`
    );
    if (alreadyAsked) return;

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
        interactive: currentQuestion.options.map(option => ({
          id: option.id,
          type: 'button',
          label: option.text,
          action: 'select'
        }))
      }
    ]);
  }, [selfAnalysisEngine]); // messages依存を除外

  const generateMatchReason = (match: CompanyMatch): string => {
    const userVector = selfAnalysisEngine.calculateUserVector();
    const companyVector = {
      workStyle: Number(match.company.workStyle),
      organization: Number(match.company.organization),
      growth: Number(match.company.growth),
      values: Number(match.company.values),
      relationships: Number(match.company.relationships),
      customerContact: Number(match.company.customerContact),
      businessStyle: Number(match.company.businessStyle),
      evaluation: Number(match.company.evaluation),
      diversity: Number(match.company.diversity),
      stability: Number(match.company.stability)
    };

    // スコア8.5以上のカテゴリを抽出
    const highScoreCategories = Object.entries(userVector)
      .filter(([_, score]) => score >= 8.5)
      .map(([category]) => category);

    // スコア差が±1.5以内のカテゴリを抽出
    const matchingCategories = highScoreCategories.filter(category => {
      const userScore = Number(userVector[category as keyof typeof userVector]);
      const companyScore = companyVector[category as keyof typeof companyVector];
      return Math.abs(userScore - companyScore) <= 1.5;
    });

    if (matchingCategories.length === 0) {
      return 'この企業はあなたの志向と複数の観点で一致しており、高い親和性が期待できます。';
    }

    // スコア順に上位2つを選択
    const topCategories = matchingCategories
      .sort((a, b) => Number(userVector[b as keyof typeof userVector]) - Number(userVector[a as keyof typeof userVector]))
      .slice(0, 2);

    const categoryNames = {
      workStyle: '働き方と裁量',
      organization: '組織文化',
      growth: '成長と挑戦',
      values: '価値観共鳴',
      relationships: '人間関係',
      customerContact: '顧客との接点',
      businessStyle: '業務スタイル',
      evaluation: '評価と報酬',
      diversity: '多様性と自分らしさ',
      stability: '安定と変化'
    };

    if (topCategories.length === 1) {
      return `あなたは「${categoryNames[topCategories[0] as keyof typeof categoryNames]}」を特に大切にしており、この企業も「${match.company[topCategories[0] as keyof typeof match.company]}」といった文化を持っています。`;
    }

    return `「${categoryNames[topCategories[0] as keyof typeof categoryNames]}」「${categoryNames[topCategories[1] as keyof typeof categoryNames]}」の両面で親和性が高く、特に「${match.company[topCategories[0] as keyof typeof match.company]}」「${match.company[topCategories[1] as keyof typeof match.company]}」といった文化がマッチします。`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isJobHuntingLoading) return;

    try {
      setIsJobHuntingLoading(true);
      setError(null);

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim(),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newMessage]);
      setInput('');

      if (!isInitialQuestionAnswered) {
        // 言語化の質問に答えた後は自己分析エンジンの質問を開始
        setIsInitialQuestionAnswered(true);
        showNextQuestion();
      } else {
        // 自己分析エンジンの質問に回答
        selfAnalysisEngine.submitAnswer(input.trim());
        showNextQuestion();
      }

      onSend?.(input.trim());
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      setError('メッセージの送信に失敗しました。');
    } finally {
      setIsJobHuntingLoading(false);
    }
  };

  const handleElementInteraction = async (elementId: string, action: string, data?: any) => {
    if (action === 'select') {
      await selfAnalysisEngine.submitAnswer(data?.value || elementId);
      showNextQuestion();

      // すべての質問に回答が完了した場合、企業マッチングを実行
      if (selfAnalysisEngine.isComplete()) {
        try {
          setIsJobHuntingLoading(true);
          const userVector = selfAnalysisEngine.calculateUserVector();
          const matches = companyMatchingEngine.findMatchingCompanies(userVector);
          
          // マッチング結果を適切な形式に変換
          const formattedMatches = matches.map(match => ({
            ...match.company,
            matchScore: match.matchScore,
            matchReason: generateMatchReason(match)
          }));

          // 表示企業数を10に設定
          setDisplayedCompaniesCount(10);
          setMatchingResults(formattedMatches);
          setShowMoreButton(formattedMatches.length > 10);

          // 既存のマッチング結果メッセージを削除
          setMessages(prev => prev.filter(msg => msg.id !== 'matching-results'));

          // 新しいマッチング結果メッセージを追加
          setMessages(prev => [
            ...prev,
            {
              id: 'matching-results',
              role: 'assistant',
              content: `あなたに最適な企業を${matches.length}社見つけました。`,
              interactive: [{
                id: 'company-grid',
                type: 'card',
                data: {
                  companies: formattedMatches,
                  displayedCount: 10,
                  showMoreButton: formattedMatches.length > 10
                }
              }]
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
        } finally {
          setIsJobHuntingLoading(false);
        }
      }
    } else if (action === 'show-more') {
      const newCount = displayedCompaniesCount + 10;
      setDisplayedCompaniesCount(newCount);
      setShowMoreButton(newCount < matchingResults.length);
      
      // メッセージの企業グリッドを更新
      setMessages(prev => prev.map(msg => {
        if (msg.id === 'matching-results' && msg.interactive) {
          return {
            ...msg,
            interactive: msg.interactive.map(element => {
              if (element.id === 'company-grid') {
                return {
                  ...element,
                  data: {
                    ...element.data,
                    displayedCount: newCount,
                    showMoreButton: newCount < matchingResults.length
                  }
                };
              }
              return element;
            })
          };
        }
        return msg;
      }));
    }
    onAnswer?.(data?.value || elementId);
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // メッセージが追加された時のみスクロール
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">チャット</h2>
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="min-h-full flex flex-col justify-end">
            <div className="p-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start space-x-3 mb-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`flex flex-col max-w-[80%] ${
                        message.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.interactive && (
                        <div className="mt-2 w-full">
                          {message.interactive.map((element) => (
                            <InteractiveElement
                              key={element.id}
                              element={element}
                              onInteraction={handleElementInteraction}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={isLoading || isJobHuntingLoading}
          />
          <Button type="submit" disabled={isLoading || isJobHuntingLoading}>
            送信
          </Button>
        </div>
      </form>
    </div>
  );
} 