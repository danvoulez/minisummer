// Webhook receiving WhatsApp messages and storing them as LogLines
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

Deno.serve(async (req) => {
  const payload = await req.json();
  const text = payload.message || '';
  await supabase.from('whatsapp_conversations').insert({ payload });
  await supabase.from('logline').insert({
    who: `whatsapp:${payload.from}`,
    did: 'registrou',
    this: { raw: text },
    status: 'raw',
    tenant_id: 'default'
  });

  return new Response('OK');
});
