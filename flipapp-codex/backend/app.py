"""Flask API exposing LogLine operations."""
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from supabase import create_client, Client

import llm_service

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'change-this'
jwt = JWTManager(app)

SUPABASE_URL = 'http://localhost'
SUPABASE_KEY = 'public-anon'
client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.post('/login')
def login():
    username = request.json.get('username')
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@app.get('/logs')
@jwt_required()
def get_logs():
    res = client.table('logline').select('*').limit(50).execute()
    return jsonify(res.data)

@app.post('/logs')
@jwt_required()
def create_log():
    data = request.json
    client.table('logline').insert(data).execute()
    return jsonify({'status': 'created'})

@app.get('/search')
@jwt_required()
def search_logs():
    query = request.args.get('q', '')
    logs = llm_service.search_logs(query)
    return jsonify(logs)

if __name__ == '__main__':
    app.run(debug=True)
