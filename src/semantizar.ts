// Supabase Edge Function: semantizar
// Fetches enriched logs, generates embeddings and suggestions, and updates them.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const SUPABASE_URL: string;
declare const SUPABASE_ANON_KEY: string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function gerarEmbedding(text: string): Promise<number[]> {
  // placeholder for embedding generation
  // in production, call an external API or local model
  return [];
}

async function gerarSugestao(text: string, tipo: string): Promise<string> {
  // placeholder for suggestion generation
  return '';
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
    const embedding = await gerarEmbedding(text);
    const resolution = await gerarSugestao(text, 'if_ok');
    const fallback = await gerarSugestao(text, 'if_doubt');
    const contingency = await gerarSugestao(text, 'if_not');

    await supabase
      .from('logline')
      .update({
        this: {
          ...log.this,
          embedding,
          resolution,
          fallback,
          contingency
        }
      })
      .eq('id', log.id);
  }

  return new Response('OK');
});
