import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { todoId } = await req.json();

    // Supabaseクライアントの初期化
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // ToDoデータの取得
    const { data: todo, error: todoError } = await supabaseClient
      .from('todos')
      .select('*')
      .eq('id', todoId)
      .single();

    if (todoError) throw todoError;

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `
以下の選考ステップについて、具体的な対策方法を説明してください：

ステップ：${todo.title}
説明：${todo.description}

以下の形式で回答してください：
1. このステップの重要性（1-2文）
2. 具体的な対策方法（箇条書き）
3. よくある質問と回答（箇条書き）
4. 注意点（箇条書き）
`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'あなたは就活アドバイザーです。選考ステップについて、具体的で実践的なアドバイスを提供してください。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const details = completion.data.choices[0].message?.content || '';

    return new Response(
      JSON.stringify({ details }),
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