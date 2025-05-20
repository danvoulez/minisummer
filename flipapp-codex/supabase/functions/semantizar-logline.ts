// Generate embeddings and move logs to contextual status
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: call OpenAI embedding endpoint
  return [];
}

Deno.serve(async () => {
  const { data: logs } = await supabase
    .from('logline')
    .select('id, this')
    .eq('status', 'enriched')
    .limit(20);

  if (!logs) return new Response('No logs');

  for (const log of logs) {
    const text = `${log.this.raw || ''} ${JSON.stringify(log.this.context || {})}`;
    const embedding = await generateEmbedding(text);
    await supabase
      .from('logline')
      .update({ this: { ...log.this, embedding } })
      .eq('id', log.id);
  }

  return new Response('OK');
});
