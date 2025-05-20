"""Helper module to call OpenAI for embeddings and suggestions."""
import openai
from supabase import create_client

SUPABASE_URL = 'http://localhost'
SUPABASE_KEY = 'public-anon'
client = create_client(SUPABASE_URL, SUPABASE_KEY)

openai.api_key = 'sk-...'

def generate_embedding(text: str) -> list:
    # TODO: call embedding API
    return []

def search_logs(query: str):
    embedding = generate_embedding(query)
    res = client.rpc('buscar_logs', {'query': query}).execute()
    return res.data
