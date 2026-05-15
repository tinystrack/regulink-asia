#!/usr/bin/env bash
# deploy-vector.sh — Vector search upgrade runbook
# Run from: ~/regulink-asia  on the US server (98.159.108.178)
#
# Usage:
#   bash deploy-vector.sh           # full install
#   bash deploy-vector.sh --skip-install   # re-deploy only (venv already exists)
#
# What this does:
#   1. Create Python virtualenv + install deps
#   2. Run MySQL migration (add embedding column)
#   3. Copy new files into place
#   4. Start embed service via PM2
#   5. Batch-generate all embeddings
#   6. Rebuild Next.js + restart app
#   7. Run test suite

set -euo pipefail
cd ~/regulink-asia

SKIP_INSTALL=${1:-""}
DB_PASS=$(grep DATABASE_PASSWORD .env.local | cut -d= -f2- | tr -d '"' | tr -d "'")
DB_PORT=$(grep DATABASE_PORT .env.local | cut -d= -f2- | tr -d '"' | tr -d "'" || echo "3201")

echo "════════════════════════════════════════════════════════"
echo "  ReguLink Asia — Vector Search Upgrade"
echo "════════════════════════════════════════════════════════"

# ── 1. Python venv ────────────────────────────────────────────────────────────
if [[ "$SKIP_INSTALL" != "--skip-install" ]]; then
  echo ""
  echo "▶ Step 1: Setting up Python virtualenv..."
  python3 -m venv venv
  source venv/bin/activate
  pip install --upgrade pip --quiet

  echo "  Installing requirements (torch CPU-only ~700MB, first run slow)..."
  # Install torch CPU-only first to avoid downloading CUDA variant
  pip install torch==2.5.1 --index-url https://download.pytorch.org/whl/cpu --quiet
  pip install -r requirements.txt --quiet
  echo "  ✓ Python deps installed"
else
  echo "▶ Step 1: Skipping install (--skip-install)"
  source venv/bin/activate
fi

# ── 2. MySQL migration ────────────────────────────────────────────────────────
echo ""
echo "▶ Step 2: Running MySQL migration..."
docker exec -i hackathon-mysql mysql -uroot -p"${DB_PASS}" regulink_asia \
  < scripts/migrate-add-embedding.sql 2>/dev/null || true
# 'true' prevents failure if column already exists (ALTER TABLE is idempotent-ish)
echo "  ✓ Migration done (embedding column added or already exists)"

# ── 3. Copy new files ─────────────────────────────────────────────────────────
echo ""
echo "▶ Step 3: Files should already be copied from your local machine."
echo "  Expected in place:"
echo "    ~/regulink-asia/embed_service.py"
echo "    ~/regulink-asia/scripts/embed.py"
echo "    ~/regulink-asia/scripts/test_vector_search.py"
echo "    ~/regulink-asia/app/api/query/route.ts   (replace existing)"
echo "    ~/regulink-asia/ecosystem.embed.config.js"
echo "    ~/regulink-asia/requirements.txt"
echo "  (if missing, scp them now and re-run with --skip-install)"

# Quick check
for f in embed_service.py scripts/embed.py app/api/query/route.ts ecosystem.embed.config.js; do
  if [[ ! -f "$f" ]]; then
    echo "  ✗ Missing: $f — aborting"
    exit 1
  fi
done
echo "  ✓ All files present"

# ── 4. Start embed service ────────────────────────────────────────────────────
echo ""
echo "▶ Step 4: Starting embed service (PM2)..."
pm2 delete regulink-embed 2>/dev/null || true
pm2 start ecosystem.embed.config.js
pm2 save

echo "  Waiting for model to load (may take 20-40s on first run)..."
for i in $(seq 1 60); do
  if curl -sf http://127.0.0.1:3111/health > /dev/null 2>&1; then
    echo "  ✓ Embed service is up"
    curl -s http://127.0.0.1:3111/health | python3 -m json.tool
    break
  fi
  sleep 2
  if [[ $i -eq 60 ]]; then
    echo "  ✗ Embed service did not start in 120s"
    pm2 logs regulink-embed --lines 30 --nostream
    exit 1
  fi
done

# ── 5. Generate embeddings ────────────────────────────────────────────────────
echo ""
echo "▶ Step 5: Generating embeddings for all 58 rules..."
venv/bin/python scripts/embed.py
echo "  ✓ All rules embedded"

# ── 6. Rebuild + restart Next.js ─────────────────────────────────────────────
echo ""
echo "▶ Step 6: Rebuilding Next.js app..."
bun run build
pm2 restart regulink-asia
echo "  ✓ Next.js restarted"

# ── 7. Run tests ──────────────────────────────────────────────────────────────
echo ""
echo "▶ Step 7: Running test suite (embed mode — direct DB)..."
venv/bin/python scripts/test_vector_search.py --mode embed --threshold 0.35

echo ""
echo "════════════════════════════════════════════════════════"
echo "  ✓ Upgrade complete!"
echo "  Demo: https://regulink.tinystrack.com"
echo ""
echo "  Useful commands:"
echo "    pm2 logs regulink-embed --lines 20   # embed service logs"
echo "    pm2 logs regulink-asia  --lines 20   # next.js logs"
echo "    curl http://127.0.0.1:3111/health    # embed service health"
echo "    python scripts/test_vector_search.py --mode api --base-url https://regulink.tinystrack.com"
echo "════════════════════════════════════════════════════════"
