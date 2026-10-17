"""Telegram service
- Receives POST /signal from strategy and sends a Telegram message with Confirm/Reject buttons
- Polls Telegram (via python-telegram-bot) to handle button presses
- On Confirm posts to strategy execute endpoint (simulate order)
- Also supports simple commands: /set_stake

Config: place config.json next to this file (do NOT commit secrets)
"""

from flask import Flask, request, jsonify
import threading
import json
import requests
import os
import sqlite3

from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Updater, CallbackQueryHandler, CommandHandler

with open('config.json') as f:
    cfg = json.load(f)

BOT_TOKEN = cfg['telegram']['bot_token']
CHAT_ID = int(cfg['telegram']['chat_id'])
MODE = cfg.get('mode', 'confirm')  # signals-only | confirm | auto
STRATEGY_EXECUTE_ENDPOINT = cfg['strategy']['execute_endpoint']

bot = Bot(token=BOT_TOKEN)
app = Flask(__name__)

# simple sqlite storage for settings and simulated trades
DB = 'state.db'

def init_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)''')
    cur.execute('''CREATE TABLE IF NOT EXISTS trades (id INTEGER PRIMARY KEY AUTOINCREMENT, pair TEXT, side TEXT, price REAL, stake REAL, ts TEXT)''')
    # default stake
    cur.execute("INSERT OR IGNORE INTO settings (key,value) VALUES ('stake','{}')".format(cfg.get('default_stake',50)))
    conn.commit()
    conn.close()

init_db()


def get_setting(key):
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute('SELECT value FROM settings WHERE key=?', (key,))
    r = cur.fetchone()
    conn.close()
    return r[0] if r else None


def set_setting(key, value):
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)', (key, str(value)))
    conn.commit()
    conn.close()


@app.route('/signal', methods=['POST'])
def signal():
    payload = request.get_json()
    threading.Thread(target=send_signal_message, args=(payload,)).start()
    return jsonify({'status':'ok'})


def send_signal_message(payload):
    text = f"Signal: {payload.get('pair')} {payload.get('type')}\nPrice: {payload.get('price')}\nTime: {payload.get('time')}\nStake suggestion: {payload.get('recommended_stake')}\nNote: {payload.get('note','') }"
    if MODE == 'signals-only':
        bot.send_message(chat_id=CHAT_ID, text=text)
        return
    keyboard = [
        [InlineKeyboardButton('Confirm ✅', callback_data=json.dumps({'action':'confirm','payload':payload})),
         InlineKeyboardButton('Reject ❌', callback_data=json.dumps({'action':'reject','payload':payload}))]
    ]
    reply = InlineKeyboardMarkup(keyboard)
    bot.send_message(chat_id=CHAT_ID, text=text, reply_markup=reply)


def on_callback(update: Update, context):
    query = update.callback_query
    data = json.loads(query.data)
    action = data.get('action')
    payload = data.get('payload')
    if action == 'confirm':
        # forward to strategy execute endpoint
        try:
            r = requests.post(STRATEGY_EXECUTE_ENDPOINT, json=payload, timeout=10)
            query.answer('Confirmed, executing (paper mode).')
            query.edit_message_text(text='Confirmed ✅ - order sent to strategy (paper).')
        except Exception as e:
            query.answer('Execution failed.')
    else:
        query.answer('Rejected.')
        query.edit_message_text(text='Rejected ❌')


def start_polling():
    updater = Updater(BOT_TOKEN, use_context=True)
    updater.dispatcher.add_handler(CallbackQueryHandler(on_callback))

    # simple command to set stake
    def set_stake(update, context):
        try:
            val = context.args[0]
n            set_setting('stake', val)
            update.message.reply_text(f'Default stake set to {val}')
        except Exception:
            update.message.reply_text('Usage: /set_stake 50')

    updater.dispatcher.add_handler(CommandHandler('set_stake', set_stake))

    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    threading.Thread(target=start_polling).start()
    app.run(host='0.0.0.0', port=8000)
