#!/usr/bin/env python3
"""
embed.py — Batch-generate embeddings for all rules and write to MySQL.

Usage:
  python embed.py                  # embed all rows missing embeddings
  python embed.py --force          # re-embed ALL rows (useful after model change)

Embedding text = concatenation of the most semantically rich fields:
  "{dimension}: {text_en} (country: {country}, law: {law}, article: {article})"

This ensures cosine similarity captures both regulatory topic AND legal context.
"""

import argparse
import json
import os
import sys
import time
import requests
import mysql.connector
from dotenv import dotenv_values

# ── Config ────────────────────────────────────────────────────────────────────
EMBED_SERVICE = os.getenv("EMBED_SERVICE_URL", "http://127.0.0.1:3111")
BATCH_SIZE = 32          # rows per embed call (keep low to avoid OOM)
ENV_FILE = '/home/lyra_tinystrack/regulink-asia/.env.local'

# ── Load env ──────────────────────────────────────────────────────────────────
env = dotenv_values(ENV_FILE)

DB_CONFIG = {
    "host":     env.get("DATABASE_HOST", "127.0.0.1"),
    "port":     int(env.get("DATABASE_PORT", "3201")),
    "user":     env.get("DATABASE_USER", "root"),
    "password": env.get("DATABASE_PASSWORD", ""),
    "database": env.get("DATABASE_NAME", "regulink_asia"),
}


def build_embed_text(row: dict) -> str:
    """
    Construct the text to embed for a rule row.
    Combining dimension + full English text + metadata gives the model enough
    context to distinguish e.g. "cross_border_transfer in China" from
    "cross_border_transfer in Singapore".
    """
    parts = [
        f"{row['dimension'].replace('_', ' ')}: {row['text_en']}",
        f"Country: {row['country']}",
        f"Law: {row['law']}",
        f"Article: {row['article']}",
        f"Requirement: {row['requirement_type']}",
    ]
    return " | ".join(parts)


def wait_for_service(timeout: int = 30):
    print(f"Waiting for embed service at {EMBED_SERVICE}/health ...")
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            r = requests.get(f"{EMBED_SERVICE}/health", timeout=3)
            if r.status_code == 200:
                info = r.json()
                print(f"  ✓ Service ready — model={info['model']} dim={info['dim']}")
                return info["dim"]
        except Exception:
            pass
        time.sleep(1)
    print("  ✗ Embed service not reachable — is embed_service.py running?")
    sys.exit(1)


def fetch_rules(conn, force: bool) -> list[dict]:
    cursor = conn.cursor(dictionary=True)
    if force:
        cursor.execute(
            "SELECT id, country, law, article, dimension, requirement_type, text_en FROM rules"
        )
    else:
        cursor.execute(
            "SELECT id, country, law, article, dimension, requirement_type, text_en "
            "FROM rules WHERE embedding IS NULL"
        )
    rows = cursor.fetchall()
    cursor.close()
    return rows


def embed_batch(texts: list[str]) -> list[list[float]]:
    r = requests.post(
        f"{EMBED_SERVICE}/embed",
        json={"texts": texts, "normalize": True},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()["embeddings"]


def write_embeddings(conn, rows_with_vecs: list[tuple]):
    cursor = conn.cursor()
    sql = (
        "UPDATE rules SET embedding = %s, embedding_updated_at = NOW() "
        "WHERE id = %s"
    )
    for rule_id, vec in rows_with_vecs:
        cursor.execute(sql, (json.dumps(vec), rule_id))
    conn.commit()
    cursor.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Re-embed all rows")
    args = parser.parse_args()

    wait_for_service()

    conn = mysql.connector.connect(**DB_CONFIG)
    print(f"Connected to MySQL: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")

    rows = fetch_rules(conn, force=args.force)
    if not rows:
        print("✓ All rules already have embeddings. Use --force to re-embed.")
        conn.close()
        return

    print(f"Embedding {len(rows)} rules (batch_size={BATCH_SIZE}) ...")

    total = 0
    t0 = time.time()
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        texts = [build_embed_text(r) for r in batch]
        vecs = embed_batch(texts)
        write_embeddings(conn, [(r["id"], v) for r, v in zip(batch, vecs)])
        total += len(batch)
        print(f"  [{total}/{len(rows)}] embedded & saved")

    elapsed = time.time() - t0
    print(f"\n✓ Done — {total} rules embedded in {elapsed:.1f}s")
    conn.close()


if __name__ == "__main__":
    main()
