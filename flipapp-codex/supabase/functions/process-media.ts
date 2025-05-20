// Process images or audio and create raw LogLines
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

async function ocrOrTranscribe(file: ArrayBuffer): Promise<string> {
  // TODO: integrate OCR/transcription
  return '';
}

Deno.serve(async (req) => {
  const body = await req.arrayBuffer();
  const text = await ocrOrTranscribe(body);
  const { error } = await supabase.from('logline').insert({
    this: { raw: text },
    status: 'raw',
    who: 'system:media',
    tenant_id: 'default'
  });

  if (error) return new Response(error.message, { status: 500 });
  return new Response('OK');
});
