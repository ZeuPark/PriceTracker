from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

DB_PATH = Path("data") / "prices.db"
DB_PATH.parent.mkdir(exist_ok=True, parents=True)

def get_conn():
    return sqlite3.connect(DB_PATH, check_same_thread=False)

# --- DB 초기화 ---
with get_conn() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS prices (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id  TEXT NOT NULL,
            title       TEXT,
            price       INTEGER,
            ts          TEXT
        )
    """)

app = FastAPI(title="Coupang Price API")

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용 - 프로덕션에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PriceIn(BaseModel):
    product_id: str
    title: str
    price: int

@app.post("/save", status_code=201)
def save_price(data: PriceIn):
    ts = datetime.utcnow().isoformat()
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO prices (product_id, title, price, ts) VALUES (?,?,?,?)",
            (data.product_id, data.title, data.price, ts),
        )
    return {"status": "ok", "ts": ts}

@app.get("/history/{product_id}")
def get_history(product_id: str, days: int = 30) -> List[dict]:
    cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT price, ts FROM prices WHERE product_id=? AND ts>=? ORDER BY ts DESC",
            (product_id, cutoff),
        ).fetchall()
    if not rows:
        raise HTTPException(404, "no data")
    return [{"price": r[0], "ts": r[1]} for r in rows]

@app.get("/")
def read_root():
    return {"message": "Coupang Price API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"} 