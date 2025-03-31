import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { answers } = await request.json();

    const prompt = `
以下の自己分析の回答から、就職活動に活用できる重要なポイントを抽出し、構造化してください。

回答内容:
${Object.entries(answers)
  .map(([category, responses]) => `
【${category}】
${responses.map((response, index) => `${index + 1}. ${response}`).join('\n')}
`)
  .join('\n')}

以下の形式でJSONを生成してください：
{
  "values": ["価値観に関する重要なポイント（3-5個）"],
  "strengths": ["強みに関する重要なポイント（3-5個）"],
  "preferences": ["興味・関心に関する重要なポイント（3-5個）"],
  "summary": "全体を総括した文章（400字程度）"
}
`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "あなたは就職活動支援のエキスパートとして、学生の自己分析結果を構造化します。回答から本質的な要素を抽出し、就職活動で活用しやすい形式にまとめます。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('APIエラー:', error);
    return NextResponse.json(
      { error: '分析結果の処理に失敗しました' },
      { status: 500 }
    );
  }
} 