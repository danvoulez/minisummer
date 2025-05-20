// Edge Function: whatsapp_webhook
// Handles incoming WhatsApp messages and stores them in whatsapp_conversations
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const SUPABASE_URL: string;
declare const SUPABASE_ANON_KEY: string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

Deno.serve(async (req) => {
  const payload = await req.json();
  const { from, message, tenant_id } = payload;

  const { data } = await supabase.from('whatsapp_conversations').insert({
    from,
    message,
    tenant_id
  }).select('id');

  await supabase.from('logline').insert({
    who: `wa:${from}`,
    tenant_id,
    this: { raw: message },
    status: 'raw'
  });

  return new Response(JSON.stringify({ conversation_id: data?.[0].id }), { status: 200 });
});
