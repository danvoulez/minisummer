// Enrich raw LogLines with tags and suggestions using OpenAI
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

async function generateTags(text: string): Promise<Record<string, unknown>> {
  // TODO: call OpenAI or local model
  return { tags: ['auto'], enriched_at: new Date().toISOString() };
}

Deno.serve(async () => {
  const { data: logs } = await supabase
    .from('logline')
    .select('id, this')
    .eq('status', 'raw')
    .limit(20);

  if (!logs) return new Response('No logs');

  for (const log of logs) {
    const enriched = await generateTags(log.this.raw || '');
    await supabase
      .from('logline')
      .update({ this: { ...log.this, ...enriched } })
      .eq('id', log.id);
  }

  return new Response('OK');
});
