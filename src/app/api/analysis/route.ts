import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { message, category } = await request.json();

    const prompt = `
あなたは就職活動支援のエキスパートです。以下の回答に対して、的確なアドバイスと掘り下げの質問を提供してください。

カテゴリー: ${category}
回答: ${message}

以下の点を考慮してアドバイスを行ってください：
1. 回答の具体性と深さ
2. 自己理解の度合い
3. 就職活動における活用方法

回答は以下の形式で行ってください：
1. 良い点の指摘
2. 改善できる点の指摘
3. より深く考えるための質問

ただし、これらを箇条書きではなく、自然な会話の流れで提供してください。
`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "あなたは就職活動支援のエキスパートとして、学生の自己分析をサポートします。親身で励ましながらも、適切な指摘と質問で深い自己理解を促します。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('APIエラー:', error);
    return NextResponse.json(
      { error: 'AIの応答の取得に失敗しました' },
      { status: 500 }
    );
  }
} 