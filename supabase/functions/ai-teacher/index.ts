import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface RequestBody {
  messages: Array<{ role: string; content: string }>;
  max_tokens?: number;
  temperature?: number;
  cost_credits?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header. Please log in.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const groqKey = Deno.env.get('GROQ_API_KEY');

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase service configuration missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!groqKey) {
      return new Response(
        JSON.stringify({
          error: 'AI service key is not configured in Supabase Secrets. Please add AI engine key in your Supabase Dashboard under Settings > Secrets.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Verify User from JWT token
    const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
    const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(jwt);

    if (userErr || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session. Please log in again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: RequestBody = await req.json();
    const costCredits = body.cost_credits ?? 1;

    // 2. Fetch or Initialize User's Monthly AI Credits
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const { data: profile, error: profErr } = await supabaseAdmin
      .from('profiles')
      .select('ai_credits, ai_credits_month, is_pro')
      .eq('id', user.id)
      .single();

    if (profErr && profErr.code !== 'PGRST116') {
      console.warn('Profile lookup error:', profErr.message);
    }

    let currentCredits = profile?.ai_credits;
    const lastMonth = profile?.ai_credits_month;

    // If a new month has started, or credits not set yet, reset to 5 free monthly credits (or 100 for Pro)
    if (currentCredits === null || currentCredits === undefined || lastMonth !== currentMonth) {
      const defaultMonthly = profile?.is_pro ? 100 : 5;
      currentCredits = defaultMonthly;
      await supabaseAdmin
        .from('profiles')
        .update({
          ai_credits: defaultMonthly,
          ai_credits_month: currentMonth,
        })
        .eq('id', user.id);
    }

    // 3. Verify Credit Balance
    if (currentCredits < costCredits) {
      return new Response(
        JSON.stringify({
          error: `Insufficient AI credits. You have ${currentCredits} credits remaining this month. This action requires ${costCredits} credit(s). Additional credits can be purchased with the Pro plan.`,
          credits: currentCredits,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Execute Inference using Groq's supported fast production models with automatic fallback
    // Primary: llama-3.3-70b-versatile, Fallbacks: llama-3.1-8b-instant, gemma2-9b-it
    const candidateModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'openai/gpt-oss-120b',
      'gemma2-9b-it',
    ];

    let lastErrMsg = 'Groq API request failed';
    let groqJson: any = null;

    for (const modelName of candidateModels) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: body.messages,
            temperature: body.temperature ?? 0.6,
            max_tokens: Math.min(body.max_tokens ?? 950, 1500),
          }),
        });

        if (groqRes.ok) {
          groqJson = await groqRes.json();
          break;
        } else {
          const errText = await groqRes.text();
          try {
            const parsed = JSON.parse(errText);
            lastErrMsg = parsed?.error?.message || errText;
          } catch {
            lastErrMsg = errText || lastErrMsg;
          }
          console.warn(`Groq model ${modelName} attempt failed: ${lastErrMsg}`);
        }
      } catch (networkErr: any) {
        lastErrMsg = networkErr?.message || String(networkErr);
      }
    }

    if (!groqJson) {
      return new Response(
        JSON.stringify({ error: `AI Engine Error: ${lastErrMsg}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const aiText = groqJson?.choices?.[0]?.message?.content || '';

    // 5. Deduct Credits Atomic update in Supabase
    const newBalance = Math.max(0, currentCredits - costCredits);
    await supabaseAdmin
      .from('profiles')
      .update({
        ai_credits: newBalance,
        ai_credits_month: currentMonth,
      })
      .eq('id', user.id);

    return new Response(
      JSON.stringify({
        content: aiText,
        credits_remaining: newBalance,
        cost: costCredits,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
