from flask import Flask, request, jsonify, render_template
from datetime import datetime
import json
import os

app = Flask(__name__, template_folder='frontend')

LOG_FILE = 'logline.voulezvous.jsonl'

@app.route('/')
def index():
    with open('prompts.extended 2.json') as f:
        prompts = json.load(f)
    return render_template('layout.html', prompts=prompts)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() or request.form.to_dict()
    logline = {
        'who': data.get('who', 'web:anon'),
        'did': data.get('did', 'registrou'),
        'this': data.get('this', {}),
        'when': data.get('when', datetime.utcnow().isoformat()),
        'confirmed_by': data.get('confirmed_by'),
        'if_ok': data.get('if_ok'),
        'if_doubt': data.get('if_doubt'),
        'if_not': data.get('if_not'),
        'status': data.get('status', 'raw')
    }
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(logline, ensure_ascii=False) + '\n')
    return jsonify({'saved': True, 'logline': logline})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
