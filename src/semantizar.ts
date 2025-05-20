// Supabase Edge Function: semantizar
// Fetches enriched logs, generates embeddings and suggestions, and updates them.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validarGhost } from './ghost_validator.ts';

declare const SUPABASE_URL: string;
declare const SUPABASE_ANON_KEY: string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


Deno.serve(async () => {
  const { data: logs } = await supabase
    .from('logline')
    .select('id, this')
    .eq('status', 'enriched')
    .limit(20);

  if (!logs) return new Response('No logs');

  for (const log of logs) {
    const text = `${log.this.raw || ''} ${JSON.stringify(log.this.context || {})}`;
    const enriched = await validarGhost(text);

    await supabase
      .from('logline')
      .update({
        this: {
          ...log.this,
          embedding: enriched.embedding,
          resolution: enriched.resolution,
          fallback: enriched.fallback,
          contingency: enriched.contingency
        }
      })
      .eq('id', log.id);
  }

  return new Response('OK');
});
