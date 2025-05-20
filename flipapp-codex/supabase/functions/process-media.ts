// Edge Function: process-media
// Receives media files, runs OCR/transcription and creates raw LogLines
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const SUPABASE_URL: string;
declare const SUPABASE_ANON_KEY: string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function transcribeMedia(url: string): Promise<string> {
  // TODO: integrate with OCR/transcription service
  return '';
}

Deno.serve(async (req) => {
  const { media_url, who, tenant_id } = await req.json();
  const text = await transcribeMedia(media_url);

  await supabase.from('logline').insert({
    who,
    tenant_id,
    this: { raw: text },
    status: 'raw'
  });

  return new Response('created');
});
