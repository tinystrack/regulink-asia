-- Migration: Add embedding column to rules table
-- Run: docker exec -i hackathon-mysql mysql -uroot -p<PASSWORD> regulink_asia < migrate-add-embedding.sql

ALTER TABLE rules
  ADD COLUMN embedding JSON NULL COMMENT 'float32 array from all-MiniLM-L6-v2 (384-dim)',
  ADD COLUMN embedding_updated_at DATETIME NULL;

-- Index to quickly find rows missing embeddings
CREATE INDEX idx_rules_embedding_null ON rules ((embedding IS NULL));
