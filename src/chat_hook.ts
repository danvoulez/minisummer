// Hook example: integrate WhatsApp messages into LogLine via Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const SUPABASE_URL: string;
declare const SUPABASE_ANON_KEY: string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function registrarMensagem(who: string, texto: string, tenant: string) {
  await supabase.from('logline').insert({
    who,
    did: 'registrou',
    this: { raw: texto },
    tenant_id: tenant
  });
}
