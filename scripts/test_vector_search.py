#!/usr/bin/env python3
"""
test_vector_search.py — Validate the vector search upgrade.

Test matrix:
  SHOULD MATCH (score >= threshold):
    ① Thailand cross-border transfer requirements
    ② Korea breach notification obligations

  SHOULD BE BLOCKED (score < threshold):
    ③ Antarctica data regulation       ← no APAC rules about Antarctica
    ④ blockchain NFT crypto trading    ← out-of-scope topic

Run:
  python scripts/test_vector_search.py

  # Or against the live Next.js API:
  python scripts/test_vector_search.py --mode api --base-url https://regulink.tinystrack.com
"""

import argparse
import json
import sys
import requests
from dataclasses import dataclass
from typing import Optional

EMBED_SERVICE = "http://127.0.0.1:3111"

# ── Test cases ────────────────────────────────────────────────────────────────
@dataclass
class Case:
    name: str
    query: str
    countries: list[str]            # [] = all countries
    expect_match: bool              # True = expect results, False = expect blocked
    expect_country: Optional[str]   # If match, at least one citation should be from here
    expect_dimension: Optional[str] # If match, expect this dimension


CASES = [
    Case(
        name="Thailand cross-border transfer",
        query="What are Thailand's requirements for transferring personal data across borders?",
        countries=["TH"],
        expect_match=True,
        expect_country="TH",
        expect_dimension="cross_border_transfer",
    ),
    Case(
        name="Korea breach notification",
        query="What are Korea's breach notification obligations for data controllers?",
        countries=["KR"],
        expect_match=True,
        expect_country="KR",
        expect_dimension="breach_notification",
    ),
    Case(
        name="Antarctica (out of scope — should be blocked)",
        query="What are the data protection regulations in Antarctica for scientific research stations?",
        countries=[],
        expect_match=False,
        expect_country=None,
        expect_dimension=None,
    ),
    Case(
        name="Blockchain/NFT (out of scope — should be blocked)",
        query="How do I trade blockchain NFTs and cryptocurrency on decentralised exchanges?",
        countries=[],
        expect_match=False,
        expect_country=None,
        expect_dimension=None,
    ),
    # Bonus sanity cases
    Case(
        name="China data localisation",
        query="Does China require certain data to be stored locally within China?",
        countries=["CN"],
        expect_match=True,
        expect_country="CN",
        expect_dimension="data_localisation",
    ),
    Case(
        name="Singapore consent requirements",
        query="What consent must be obtained before collecting personal data in Singapore?",
        countries=["SG"],
        expect_match=True,
        expect_country="SG",
        expect_dimension="consent",
    ),
]

# ── Direct embed + DB test (no Next.js needed) ────────────────────────────────
def run_embed_mode(threshold: float = 0.35):
    """
    Test the embed service directly. Loads DB rules, scores them locally.
    Requires: embed_service running, DB accessible from this machine.
    """
    import mysql.connector
    from dotenv import dotenv_values
    import os

    env = dotenv_values(os.path.join(os.path.dirname(__file__), "..", ".env.local"))
    conn = mysql.connector.connect(
        host=env.get("DATABASE_HOST", "127.0.0.1"),
        port=int(env.get("DATABASE_PORT", "3201")),
        user=env.get("DATABASE_USER", "root"),
        password=env.get("DATABASE_PASSWORD", ""),
        database=env.get("DATABASE_NAME", "regulink_asia"),
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, country, dimension, requirement_type, embedding FROM rules "
        "WHERE embedding IS NOT NULL"
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    print(f"Loaded {len(rows)} rules from DB\n")

    def dot(a, b):
        return sum(x * y for x, y in zip(a, b))

    passed = 0
    failed = 0
    for case in CASES:
        # Embed query
        r = requests.post(
            f"{EMBED_SERVICE}/embed_one",
            json={"text": case.query, "normalize": True},
            timeout=10,
        )
        r.raise_for_status()
        q_vec = r.json()["embedding"]

        # Score rows (apply country filter if present)
        candidates = rows
        if case.countries:
            candidates = [r for r in rows if r["country"] in case.countries]

        scored = sorted(
            [{"row": r, "score": dot(q_vec, json.loads(r["embedding"]))} for r in candidates],
            key=lambda x: x["score"],
            reverse=True,
        )
        top_score = scored[0]["score"] if scored else 0.0
        above_threshold = [s for s in scored if s["score"] >= threshold]

        ok = True
        notes = []

        if case.expect_match:
            if not above_threshold:
                ok = False
                notes.append(f"Expected match but top score={top_score:.3f} < threshold={threshold}")
            else:
                top = above_threshold[0]
                if case.expect_country and top["row"]["country"] != case.expect_country:
                    ok = False
                    notes.append(
                        f"Top match country={top['row']['country']}, "
                        f"expected={case.expect_country}"
                    )
                if case.expect_dimension:
                    dims = {s["row"]["dimension"] for s in above_threshold}
                    if case.expect_dimension not in dims:
                        ok = False
                        notes.append(
                            f"Expected dimension '{case.expect_dimension}' not in results: {dims}"
                        )
        else:  # expect blocked
            if above_threshold:
                ok = False
                notes.append(
                    f"Expected block but {len(above_threshold)} result(s) above threshold. "
                    f"Top: {above_threshold[0]['row']['id']} score={above_threshold[0]['score']:.3f}"
                )

        status = "✓ PASS" if ok else "✗ FAIL"
        if ok:
            passed += 1
        else:
            failed += 1

        print(f"{status}  {case.name}")
        print(f"       top_score={top_score:.4f}  above_threshold={len(above_threshold)}")
        if notes:
            for n in notes:
                print(f"       ↳ {n}")
        print()

    print("─" * 50)
    print(f"Results: {passed} passed, {failed} failed out of {len(CASES)} cases")
    if failed > 0:
        sys.exit(1)


# ── API mode (test against live Next.js endpoint) ─────────────────────────────
def run_api_mode(base_url: str):
    passed = 0
    failed = 0
    for case in CASES:
        payload = {"question": case.query, "countries": case.countries}
        r = requests.post(f"{base_url}/api/query", json=payload, timeout=30)

        if r.status_code != 200:
            print(f"✗ FAIL  {case.name}")
            print(f"       HTTP {r.status_code}: {r.text[:200]}")
            failed += 1
            continue

        data = r.json()
        citations = data.get("citations", [])
        top_score = data.get("topScore", 0)
        threshold = data.get("threshold", 0.35)
        answer = data.get("answer", "")

        ok = True
        notes = []

        if case.expect_match:
            if not citations:
                # Check if it was blocked due to low score
                if "No rule found" in answer:
                    ok = False
                    notes.append(f"Blocked: top_score={top_score:.3f} < threshold={threshold}")
                else:
                    notes.append("No citations but answer present — check manually")
            if case.expect_country:
                countries = {c["country"] for c in citations}
                if case.expect_country not in countries:
                    ok = False
                    notes.append(f"Expected country {case.expect_country} not in citations: {countries}")
        else:
            if citations:
                ok = False
                notes.append(f"Expected block but got {len(citations)} citation(s)")
            elif "No rule found" not in answer:
                notes.append("No citations but answer is not the blocked message — check manually")

        status = "✓ PASS" if ok else "✗ FAIL"
        if ok:
            passed += 1
        else:
            failed += 1

        print(f"{status}  {case.name}")
        print(f"       top_score={top_score:.4f}  citations={len(citations)}")
        if notes:
            for n in notes:
                print(f"       ↳ {n}")
        print()

    print("─" * 50)
    print(f"Results: {passed} passed, {failed} failed out of {len(CASES)} cases")
    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mode",
        choices=["embed", "api"],
        default="embed",
        help="embed = direct DB test, api = test via Next.js /api/query",
    )
    parser.add_argument("--base-url", default="http://127.0.0.1:3110")
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.52,
        help="Cosine similarity threshold for 'no result' classification",
    )
    args = parser.parse_args()

    if args.mode == "embed":
        run_embed_mode(threshold=args.threshold)
    else:
        run_api_mode(base_url=args.base_url)
