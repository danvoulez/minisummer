"""Flask API exposing LogLine CRUD and search."""
from flask import Flask, request, jsonify
from supabase import create_client
import llm_service

app = Flask(__name__)

SUPABASE_URL = 'http://localhost:54321'
SUPABASE_KEY = 'anon'
sb = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/logs', methods=['GET', 'POST'])
def logs():
    if request.method == 'POST':
        data = request.json
        sb.table('logline').insert(data).execute()
        return '', 201
    res = sb.table('logline').select('*').limit(100).execute()
    return jsonify(res.data)

@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('query', '')
    result = sb.rpc('buscar_logs', {'query': query}).execute()
    return jsonify(result.data)

if __name__ == '__main__':
    app.run()
