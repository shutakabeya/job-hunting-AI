'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useRouter } from 'next/navigation';
import { ChatMessage, ChatContext } from '@/types/chat';
import { generateId } from '@/lib/utils';

const analysisSteps = [
  {
      category: '価値観',
    questions: [
      '仕事を選ぶ際に最も重視することは何ですか？',
      '理想の働き方について教えてください。',
      '長期的なキャリアの目標を教えてください。'
    ]
  },
  {
    category: '強み',
    questions: [
      'あなたの得意なことは何ですか？',
      '過去の経験で、最も成功を感じた出来事は何ですか？',
      'チームでの活動で、あなたはどのような役割を果たすことが多いですか？'
    ]
  },
  {
      category: '興味',
    questions: [
      '興味のある業界や職種を教えてください。',
      'どのような課題に取り組みたいですか？',
      '学生時代に熱心に取り組んだことは何ですか？'
    ]
  }
];

export default function SelfAnalysisPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const router = useRouter();

  const currentStep = analysisSteps[currentStepIndex];
  const currentQuestion = currentStep?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentStep?.questions.length - 1;
  const isLastStep = currentStepIndex === analysisSteps.length - 1;

  const handleAnswer = async (answer: string) => {
    setIsLoading(true);
    try {
      // 回答を保存
      const newAnswers = { ...answers };
      if (!newAnswers[currentStep.category]) {
        newAnswers[currentStep.category] = [];
      }
      newAnswers[currentStep.category].push(answer);
      setAnswers(newAnswers);

      // メッセージを更新
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: answer,
        timestamp: Date.now(),
        interactive: []
      };
      const newMessages = [...messages, userMessage];

      // AIの応答を取得
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: answer,
          category: currentStep.category,
        }),
      });

      if (!response.ok) {
        throw new Error('AIの応答の取得に失敗しました');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        interactive: data.interactive || []
      };
      newMessages.push(assistantMessage);
      setMessages(newMessages);

      // 次の質問または次のステップへ
      if (isLastQuestion) {
        if (isLastStep) {
          // 全ての質問が終了
          const analysisResult = await processAnalysisResults(newAnswers);
          router.push('/companies');
        } else {
          // 次のカテゴリーへ
          setCurrentStepIndex(currentStepIndex + 1);
          setCurrentQuestionIndex(0);
        }
      } else {
        // 次の質問へ
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error) {
      console.error('エラー:', error);
      alert(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalysisResults = async (answers: Record<string, string[]>) => {
    try {
      const response = await fetch('/api/process-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('分析結果の処理に失敗しました');
      }

      return await response.json();
    } catch (error) {
      console.error('分析結果の処理エラー:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col">
        <h1 className="text-4xl font-bold text-center mb-4">自己分析</h1>
        <p className="text-center text-gray-600 mb-8">
          {currentStep.category}に関する質問にお答えください
        </p>
        <div className="flex-grow border rounded-lg overflow-hidden bg-white shadow-lg">
          <ChatInterface
            messages={messages}
            onSend={() => {}}
            isLoading={isLoading}
            context={{
              phase: 'self_analysis',
              topic: currentStep.category,
              currentQuestion: currentQuestion
            }}
            onAnswer={handleAnswer}
          />
        </div>
      </div>
    </div>
  );
} 