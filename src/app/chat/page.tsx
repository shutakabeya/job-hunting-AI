'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { MasterDataService } from '@/lib/data/master-data';
import { ChatContext } from '@/types/chat';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId');
  const companyName = searchParams.get('companyName');
  const [initialContext, setInitialContext] = useState<ChatContext | null>(null);

  useEffect(() => {
    const initializeContext = async () => {
      if (!companyId || !companyName) return;

      try {
        const masterDataService = MasterDataService.getInstance();
        
        // 企業の情報を取得
        const companyData = await masterDataService.getCompanyData(companyId);
        if (!companyData) throw new Error('企業データが見つかりません');

        // マスターデータからToDoを取得
        const todos = await masterDataService.getCompanyTodos(companyName);

        // 初期コンテキストを設定
        setInitialContext({
          phase: 'preparation',
          metadata: {
            company: {
              id: companyId,
              name: companyName,
              ...companyData
            },
            todos
          }
        });
      } catch (error) {
        console.error('データの初期化に失敗しました:', error);
      }
    };

    initializeContext();
  }, [companyId, companyName]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ChatInterface initialContext={initialContext} />
      </div>
    </div>
  );
} 