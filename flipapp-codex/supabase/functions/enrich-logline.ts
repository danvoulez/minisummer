// Edge Function: enrich-logline
// Reads raw loglines and adds basic tags using LLM service
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const SUPABASE_URL: string;
declare const SUPABASE_ANON_KEY: string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateTags(text: string): Promise<string[]> {
  // TODO: call OpenAI or other service
  return ['auto'];
}

Deno.serve(async () => {
  const { data: logs } = await supabase
    .from('logline')
    .select('id, this')
    .eq('status', 'raw')
    .limit(20);

  if (!logs) return new Response('No logs');

  for (const log of logs) {
    const text = log.this.raw || '';
    const tags = await generateTags(text);
    await supabase
      .from('logline')
      .update({ this: { ...log.this, tags } })
      .eq('id', log.id);
  }

  return new Response('enriched');
});
