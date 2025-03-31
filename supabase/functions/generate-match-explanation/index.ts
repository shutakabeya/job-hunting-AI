import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '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';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://vzmdxtkeyyzmdkaslemt.supabase.co';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bWR4dGtleXl6bWRrYXNsZW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTIyNTAsImV4cCI6MjA1Nzc2ODI1MH0.JDFa7BH2eneg4W-ChwQpTg7MLfDm86AmFHXwBBsBNDg';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userVector, company, matchingCategories } = await req.json();

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `
以下の情報に基づいて、ユーザーと${company.name}のマッチングについて説明を生成してください：

ユーザーの特徴：
${userVector.categories.map((category, index) => 
  `${category}: ${userVector.scores[index]}`
).join('\n')}

マッチングしているカテゴリ：
${matchingCategories.join(', ')}

企業の特徴：
${company.tags.join(', ')}

以下の形式で回答してください：
1. マッチングの理由（2-3文）
2. ユーザーの強み（箇条書き）
3. 改善点（箇条書き）
`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'あなたは就活アドバイザーです。ユーザーと企業のマッチングについて、具体的で建設的なフィードバックを提供してください。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const explanation = completion.data.choices[0].message?.content || '';

    return new Response(
      JSON.stringify({ explanation }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
}); 