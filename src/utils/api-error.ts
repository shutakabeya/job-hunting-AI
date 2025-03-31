import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  console.error('APIエラー:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    // OpenAI APIのエラーハンドリング
    if (error.message.includes('OpenAI')) {
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: 'APIの利用制限を超過しました。しばらく時間をおいてから再度お試しください。', code: 'RATE_LIMIT' },
          { status: 429 }
        );
      }
      if (error.message.includes('Invalid API key')) {
        return NextResponse.json(
          { error: 'APIキーが無効です。環境変数の設定を確認してください。', code: 'INVALID_API_KEY' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: error.message, code: 'UNKNOWN_ERROR' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: '予期せぬエラーが発生しました', code: 'UNKNOWN_ERROR' },
    { status: 500 }
  );
} 