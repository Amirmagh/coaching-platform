"""Simple execute service (paper mode)
Receives POST /execute and logs the simulated trade to sqlite
"""
from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)
DB = 'state.db'

@app.route('/execute', methods=['POST'])
def execute():
    payload = request.get_json()
    pair = payload.get('pair')
    side = payload.get('type')
    price = float(payload.get('price', 0))
    stake = float(payload.get('recommended_stake', 0))
    ts = datetime.utcnow().isoformat()
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute('INSERT INTO trades (pair, side, price, stake, ts) VALUES (?,?,?,?,?)', (pair, side, price, stake, ts))
    conn.commit()
    conn.close()
    return jsonify({'status':'ok','executed_at':ts})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
