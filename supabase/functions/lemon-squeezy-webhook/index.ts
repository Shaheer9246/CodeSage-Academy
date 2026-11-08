import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

/**
 * Lemon Squeezy Webhook Handler for CodeSage
 * Listens for:
 * - order_created
 * - subscription_created
 * - subscription_updated
 * - subscription_cancelled
 * - subscription_expired
 * 
 * Automatically upgrades the student account to PRO (is_pro: true, ai_credits: 100)
 * matching the user_id passed in custom data or customer email.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const webhookSecret = Deno.env.get('LEMON_SQUEEZY_WEBHOOK_SECRET');

    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase service configuration missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');

    // Signature verification is mandatory: reject anything unsigned or unverifiable.
    if (!webhookSecret) {
      console.error('[Lemon Squeezy] LEMON_SQUEEZY_WEBHOOK_SECRET is not configured; rejecting webhook.');
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      );
      const verified = await crypto.subtle.verify(
        'HMAC',
        key,
        hexToUint8Array(signature),
        encoder.encode(rawBody)
      );
      if (!verified) {
        return new Response(JSON.stringify({ error: 'Invalid HMAC signature' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event?.meta?.event_name;
    const customData = event?.meta?.custom_data;
    const customerEmail = event?.data?.attributes?.user_email || event?.data?.attributes?.customer_email;
    const userId = customData?.user_id;

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    console.log(`[Lemon Squeezy] Received event: ${eventName || 'unknown'}`);

    let targetUserId = userId;

    // If userId was not passed directly in checkout custom data, look up user by email
    if (!targetUserId && customerEmail) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .maybeSingle();

      if (profile) {
        targetUserId = profile.id;
      }
    }

    if (!targetUserId) {
      console.warn(`[Lemon Squeezy] No account matched transaction event: ${eventName || 'unknown'}`);
      return new Response(JSON.stringify({ received: true, message: 'User not found in CodeSage' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle events
    if (
      eventName === 'order_created' ||
      eventName === 'subscription_created' ||
      eventName === 'subscription_resumed'
    ) {
      // Upgrade student to PRO
      const { error: updateErr } = await supabaseAdmin
        .from('profiles')
        .update({
          is_pro: true,
          ai_credits: 100,
        })
        .eq('id', targetUserId);

      if (updateErr) {
        console.error('Failed to upgrade user to PRO:', updateErr);
        return new Response(JSON.stringify({ error: updateErr.message }), { status: 500, headers: corsHeaders });
      }

      console.log('[Lemon Squeezy] Successfully upgraded account to PRO.');
    } else if (eventName === 'subscription_expired' || eventName === 'subscription_cancelled') {
      // Revert student to Free Tier
      await supabaseAdmin
        .from('profiles')
        .update({
          is_pro: false,
          ai_credits: 5,
        })
        .eq('id', targetUserId);

      console.log('[Lemon Squeezy] Reverted account to Free Tier.');
    }

    return new Response(JSON.stringify({ success: true, event: eventName }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[Lemon Squeezy Webhook Error]:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}
