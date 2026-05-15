#!/usr/bin/env bash
# deploy-expand.sh — Run after files are in place
# Expands ReguLink Asia from 58 → ~118 rules, adds 2 new dimensions, 4 new countries
set -euo pipefail
cd ~/regulink-asia

DB_PASS=$(grep DATABASE_PASSWORD .env.local | cut -d= -f2-)

echo "════════════════════════════════════════════════════════"
echo "  ReguLink Asia — Data Expansion"
echo "  New countries: AU / MY / PH / NZ"
echo "  New dimensions: data_portability / algorithmic_decision"
echo "════════════════════════════════════════════════════════"

# ── 1. Extend MySQL ENUM ──────────────────────────────────────────────────────
echo ""
echo "▶ Step 1: Extending dimension ENUM in MySQL..."
docker exec -i hackathon-mysql mysql -uroot -p"${DB_PASS}" regulink_asia \
  < scripts/migrate-expand.sql
echo "  ✓ ENUM extended"

# ── 2. Replace types.ts ───────────────────────────────────────────────────────
echo ""
echo "▶ Step 2: Updating lib/types.ts..."
# (file already moved by mv commands)
echo "  ✓ types.ts updated"

# ── 3. Run all seed scripts ───────────────────────────────────────────────────
echo ""
echo "▶ Step 3: Seeding new data..."
for script in seed-au seed-my seed-ph seed-nz seed-supplement; do
  echo "  Running $script.ts ..."
  bun run scripts/${script}.ts
done
echo "  ✓ All seed scripts complete"

# ── 4. Count rules ────────────────────────────────────────────────────────────
echo ""
echo "▶ Step 4: Verifying rule count..."
docker exec hackathon-mysql mysql -uroot -p"${DB_PASS}" regulink_asia \
  -e "SELECT country, COUNT(*) as rules FROM rules GROUP BY country ORDER BY country;"

docker exec hackathon-mysql mysql -uroot -p"${DB_PASS}" regulink_asia \
  -e "SELECT COUNT(*) as total_rules FROM rules;"

# ── 5. Re-embed all rules (--force because new rows + new dimension text) ─────
echo ""
echo "▶ Step 5: Re-embedding all rules (--force)..."
venv/bin/python scripts/embed.py --force
echo "  ✓ Embeddings complete"

# ── 6. Rebuild + restart ──────────────────────────────────────────────────────
echo ""
echo "▶ Step 6: Rebuilding Next.js..."
bun run build
pm2 restart regulink-asia
echo "  ✓ Next.js restarted"

# ── 7. Run tests ──────────────────────────────────────────────────────────────
echo ""
echo "▶ Step 7: Running test suite..."
venv/bin/python scripts/test_vector_search.py --threshold 0.52

echo ""
echo "════════════════════════════════════════════════════════"
echo "  ✓ Expansion complete!"
echo "════════════════════════════════════════════════════════"
