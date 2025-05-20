// Ghost validator: uses OpenAI to complete raw loglines
import { gerarEmbedding } from './embedding.ts';

const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
const GPT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(prompt: string): Promise<string> {
  const body = {
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  };
  const resp = await fetch(GPT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) throw new Error(`openai error: ${resp.status}`);
  const json = await resp.json();
  return json.choices[0].message.content as string;
}

export interface GhostResult {
  resolution: string;
  fallback: string;
  contingency: string;
  embedding: number[];
  confirmed_by?: string;
}

export async function validarGhost(raw: string): Promise<GhostResult> {
  const prompt = `Analise o seguinte evento e gere campos resolution, fallback e contingency: ${raw}`;
  const content = OPENAI_KEY ? await callOpenAI(prompt) : '';
  const embedding = await gerarEmbedding(raw);
  return {
    resolution: content || '',
    fallback: '',
    contingency: '',
    embedding
  };
}
