"""Helper for OpenAI calls providing embeddings and suggestions."""
import os
import openai

openai.api_key = os.getenv('OPENAI_API_KEY')

async def embedding(text: str) -> list[float]:
    resp = await openai.Embedding.acreate(model='text-embedding-ada-002', input=text)
    return resp['data'][0]['embedding']

async def suggest(text: str, kind: str) -> str:
    prompt = f"{kind}: {text}"
    resp = await openai.ChatCompletion.acreate(model='gpt-4', messages=[{'role':'user','content':prompt}])
    return resp.choices[0].message.content
