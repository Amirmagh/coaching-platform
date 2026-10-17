"""Simple scalp strategy engine
- Fetches 5m OHLCV from Binance (via ccxt)
- Calculates EMA(8) and EMA(21) on recent candles
- On bullish crossover sends signal POST to telegram service
- Dry-run by default; does not send real orders

Config: mount a local config.json at project root (see config.example.json)
"""

import time
import json
import threading
import requests
from datetime import datetime, timedelta
import pandas as pd
import ccxt

# load config
with open("config.json") as f:
    cfg = json.load(f)

PAIR = cfg.get("pair", "BTC/USDT")
TIMEFRAME = cfg.get("timeframe", "5m")
DAYS = int(cfg.get("days", 365))
DRY_RUN = cfg.get("dry_run", True)
POLL_INTERVAL = int(cfg.get("poll_interval", 30))
TELEGRAM_ENDPOINT = cfg["telegram"]["endpoint"]
DEFAULT_STAKE = cfg.get("default_stake", 50)

# If running in docker-compose, you may want telegram endpoint like: http://telegram:8000/signal

exchange = ccxt.binance({
    'enableRateLimit': True,
})

def fetch_ohlcv_since(pair, timeframe, since_ms=None, limit=1000):
    try:
        data = exchange.fetch_ohlcv(pair, timeframe=timeframe, since=since_ms, limit=limit)
    except Exception as e:
        print("fetch error:", e)
        return pd.DataFrame()
    if not data:
        return pd.DataFrame()
    df = pd.DataFrame(data, columns=["ts","open","high","low","close","volume"])
    df['date'] = pd.to_datetime(df['ts'], unit='ms')
    df.set_index('date', inplace=True)
    return df

def load_history(pair, timeframe, days):
    since = int((datetime.utcnow() - timedelta(days=days)).timestamp() * 1000)
    frames = []
    since_ms = since
    while True:
        df = fetch_ohlcv_since(pair, timeframe, since_ms=since_ms, limit=1000)
        if df.empty:
            break
        frames.append(df)
        last_ts = int(df.index[-1].timestamp() * 1000)
        since_ms = last_ts + 1
        if len(df) < 1000:
            break
    if not frames:
        return pd.DataFrame()
    full = pd.concat(frames).drop_duplicates().sort_index()
    return full


def add_indicators(df):
    if df.empty:
        return df
    df['ema_fast'] = df['close'].ewm(span=8, adjust=False).mean()
    df['ema_slow'] = df['close'].ewm(span=21, adjust=False).mean()
    df['atr'] = (df['high'] - df['low']).rolling(14).mean()
    return df


def generate_signal_for_row(df):
    """Return True if bullish EMA crossover happened on last bar"""
    if df.shape[0] < 3:
        return False
    last = df.iloc[-1]
    prev = df.iloc[-2]
    # bullish crossover: fast crosses above slow
    if (last['ema_fast'] > last['ema_slow']) and (prev['ema_fast'] <= prev['ema_slow']):
        return True
    return False


def notify_telegram(payload):
    try:
        requests.post(TELEGRAM_ENDPOINT, json=payload, timeout=10)
    except Exception as e:
        print('telegram notify failed', e)


def main_loop():
    print('Loading historical data...')
    hist = load_history(PAIR, TIMEFRAME, DAYS)
    if hist.empty:
        print('No historical data, exiting')
        return
    hist = add_indicators(hist)
    last_checked = None
    print('Entering polling loop, pair=', PAIR)
    while True:
        try:
            recent = fetch_ohlcv_since(PAIR, TIMEFRAME, since_ms=None, limit=50)
            if recent.empty:
                time.sleep(POLL_INTERVAL)
                continue
            recent = add_indicators(recent)
            if last_checked is None or recent.index[-1] > last_checked:
                if generate_signal_for_row(recent):
                    row = recent.iloc[-1]
                    payload = {
                        'pair': PAIR,
                        'time': recent.index[-1].isoformat(),
                        'price': float(row['close']),
                        'type': 'LONG',
                        'recommended_stake': DEFAULT_STAKE,
                        'note': 'EMA8/21 crossover'
                    }
                    print('Signal generated:', payload)
                    notify_telegram(payload)
                last_checked = recent.index[-1]
        except Exception as e:
            print('error in loop', e)
        time.sleep(POLL_INTERVAL)

if __name__ == '__main__':
    main_loop()
