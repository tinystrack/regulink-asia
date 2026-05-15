"""
ReguLink Asia — Embedding Service
Port: 3111
Model: sentence-transformers/all-MiniLM-L6-v2 (384-dim, ~90MB)

Endpoints:
  POST /embed          { "texts": ["..."] }  → { "embeddings": [[...]] }
  POST /embed_one      { "text": "..." }      → { "embedding": [...], "dim": 384 }
  GET  /health                                → { "status": "ok", "model": "...", "dim": 384 }
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np
import uvicorn
import os
import logging
import time

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# ── Model loading (happens once at startup, stays in memory) ──────────────────
MODEL_NAME = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
logger.info(f"Loading model: {MODEL_NAME}")
t0 = time.time()
model = SentenceTransformer(MODEL_NAME)
logger.info(f"Model loaded in {time.time() - t0:.2f}s, embedding dim={model.get_sentence_embedding_dimension()}")

EMBED_DIM = model.get_sentence_embedding_dimension()  # 384

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(title="ReguLink Embedding Service", version="1.0.0")


class EmbedBatchRequest(BaseModel):
    texts: List[str]
    normalize: bool = True          # L2-normalize → cosine similarity = dot product


class EmbedOneRequest(BaseModel):
    text: str
    normalize: bool = True


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": MODEL_NAME,
        "dim": EMBED_DIM,
    }


@app.post("/embed")
def embed_batch(req: EmbedBatchRequest):
    """Batch encode. Used by embed.py seed script."""
    if not req.texts:
        raise HTTPException(status_code=400, detail="texts must be non-empty")
    if len(req.texts) > 512:
        raise HTTPException(status_code=400, detail="max 512 texts per batch")

    vecs = model.encode(
        req.texts,
        normalize_embeddings=req.normalize,
        batch_size=64,
        show_progress_bar=False,
    )
    return {"embeddings": vecs.tolist(), "dim": EMBED_DIM}


@app.post("/embed_one")
def embed_one(req: EmbedOneRequest):
    """Single query encode. Called by Next.js /api/query at request time."""
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="text must be non-empty")

    vec = model.encode(
        req.text.strip(),
        normalize_embeddings=req.normalize,
        show_progress_bar=False,
    )
    return {"embedding": vec.tolist(), "dim": EMBED_DIM}


if __name__ == "__main__":
    port = int(os.getenv("EMBED_PORT", "3111"))
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
