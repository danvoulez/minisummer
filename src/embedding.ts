// Utility for generating embeddings using OpenAI with local fallback
import { encode } from 'https://deno.land/std@0.203.0/encoding/utf8.ts';

const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
const ENDPOINT = 'https://api.openai.com/v1/embeddings';

async function gerarEmbeddingRemoto(text: string): Promise<number[]> {
  const body = {
    input: text,
    model: 'text-embedding-ada-002'
  };
  const resp = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) throw new Error(`embedding api error: ${resp.status}`);
  const json = await resp.json();
  return json.data[0].embedding as number[];
}

export async function gerarEmbedding(text: string): Promise<number[]> {
  if (OPENAI_KEY) {
    try {
      return await gerarEmbeddingRemoto(text);
    } catch (_) {
      // fall back below
    }
  }
  // local fallback: simple hash to vector
  const encoded = encode(text);
  const arr = new Array(10).fill(0);
  for (let i = 0; i < encoded.length; i++) {
    arr[i % arr.length] += encoded[i];
  }
  const norm = Math.sqrt(arr.reduce((a, b) => a + b ** 2, 0));
  return arr.map((v) => v / norm);
}
