// app/api/query/route.ts
// ReguLink Asia — RAG Query Engine (Vector Search Edition)
//
// Flow:
//   1. Embed the user's question via FastAPI embed service (localhost:3111)
//   2. Load all rules + their embeddings from MySQL
//   3. Cosine similarity (dot product of L2-normalised vectors) → Top-K
//   4. Optional country filter applied AFTER scoring
//   5. Low-similarity results filtered out (threshold = 0.52)
//   6. Groq LLM generates answer from retrieved context
//   7. Regex extracts [rule_id] citations from LLM output
//   7B. If LLM produced no citations → transparent rejection (deterministic 0% confidence)
//   8. Confidence Score computed from cited rules only (not just retrieved)

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { buildRAGPrompt } from "@/lib/prompt";
import { RuleNode, Citation } from "@/lib/types";
import { RowDataPacket } from "mysql2";

const EMBED_SERVICE = process.env.EMBED_SERVICE_URL ?? "http://127.0.0.1:3111";
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_BASE_URL = process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

// ── Tuning knobs ──────────────────────────────────────────────────────────────
const SIMILARITY_THRESHOLD = 0.52; // below this → "no relevant rule found"
const TOP_K = 8;                   // max rules fed to LLM context

// ── Types ─────────────────────────────────────────────────────────────────────
interface RuleRow extends RowDataPacket {
  id: string;
  country: string;
  law: string;
  article: string;
  dimension: string;
  requirement_type: string;
  mechanism: string | null;
  text_en: string;
  source_url: string | null;
  effective_date: string | null;
  source_authority: string;
  embedding: string | null; // JSON-encoded float array
}

// ── Cosine similarity (dot product; vectors are L2-normalised at embed time) ──
function dotProduct(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

// ── Embed the query via FastAPI service ───────────────────────────────────────
async function embedQuery(text: string): Promise<number[]> {
  const res = await fetch(`${EMBED_SERVICE}/embed_one`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, normalize: true }),
    // Give up quickly so the UI doesn't hang if the service is down
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    throw new Error(`Embed service error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.embedding as number[];
}

// ── Confidence Score (unchanged deterministic formula) ────────────────────────
function computeConfidenceScore(rules: RuleNode[]): number {
  if (rules.length === 0) return 0;

  const authorityMap: Record<string, number> = {
    official_law: 1.0,
    official_amendment: 0.9,
    ministry_guideline: 0.7,
    paraphrase: 0.5,
  };

  const avgAuthority =
    rules.reduce((sum, r) => sum + (authorityMap[r.source_authority] ?? 0.5), 0) /
    rules.length;

  const coverageScore = Math.min(rules.length / 5, 1.0);
  const mandatoryBonus = rules.some((r) => r.requirement_type === "mandatory") ? 0.05 : 0;

  return Math.min(avgAuthority * 0.6 + coverageScore * 0.35 + mandatoryBonus, 1.0);
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = (body.question ?? "").trim();
    const countryFilter: string[] = body.countries ?? []; // [] = no filter

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    // ── 1. Embed the question ─────────────────────────────────────────────────
    let queryVec: number[];
    try {
      queryVec = await embedQuery(question);
    } catch (err) {
      console.error("[query] embed service unavailable:", err);
      return NextResponse.json(
        { error: "Embedding service unavailable. Is embed_service.py running on port 3111?" },
        { status: 503 }
      );
    }

    // ── 2. Load all rules with embeddings from MySQL ──────────────────────────
    const conn = await pool.getConnection();
    let rows: RuleRow[];
    try {
      const countryClause =
        countryFilter.length > 0
          ? `AND country IN (${countryFilter.map(() => "?").join(",")})`
          : "";

      const [result] = await conn.query<RuleRow[]>(
        `SELECT id, country, law, article, dimension, requirement_type,
                mechanism, text_en, source_url, effective_date, source_authority,
                embedding
         FROM rules
         WHERE embedding IS NOT NULL ${countryClause}`,
        countryFilter.length > 0 ? countryFilter : []
      );
      rows = result;
    } finally {
      conn.release();
    }

    if (rows.length === 0) {
      return NextResponse.json({
        answer: "No rules found in the database for the selected countries.",
        citations: [],
        confidence: 0,
        retrievedCount: 0,
        citedCount: 0,
        topScore: 0,
        threshold: SIMILARITY_THRESHOLD,
      });
    }

    // ── 3. Score every rule by cosine similarity ──────────────────────────────
    const scored = rows
      .map((row) => {
        if (!row.embedding) return { row, score: 0 };
        let vec: number[];
        try {
          vec = Array.isArray(row.embedding) ? row.embedding : JSON.parse(row.embedding) as number[];
        } catch {
          return { row, score: 0 };
        }
        return { row, score: dotProduct(queryVec, vec) };
      })
      .sort((a, b) => b.score - a.score);

    const topScore = scored[0]?.score ?? 0;

    // ── 4. Apply threshold + take Top-K ──────────────────────────────────────
    const relevant = scored
      .filter((s) => s.score >= SIMILARITY_THRESHOLD)
      .slice(0, TOP_K);

    if (relevant.length === 0) {
      return NextResponse.json({
        answer:
          "No rule found in current database for this query. " +
          `(Best match score: ${topScore.toFixed(3)}, threshold: ${SIMILARITY_THRESHOLD})`,
        citations: [],
        confidence: 0,
        retrievedCount: 0,
        citedCount: 0,
        topScore: parseFloat(topScore.toFixed(3)),
        threshold: SIMILARITY_THRESHOLD,
      });
    }

    // ── 5. Build RuleNode array for LLM context ───────────────────────────────
    const retrievedRules: RuleNode[] = relevant.map(({ row }) => ({
      id: row.id,
      country: row.country,
      law: row.law,
      article: row.article,
      dimension: row.dimension as RuleNode["dimension"],
      requirement_type: row.requirement_type as RuleNode["requirement_type"],
      mechanism: Array.isArray(row.mechanism) ? row.mechanism : (row.mechanism ? JSON.parse(row.mechanism) : []),
      text_en: row.text_en,
      source_url: row.source_url ?? "",
      effective_date: row.effective_date ?? "",
      source_authority: row.source_authority as RuleNode["source_authority"],
    }));

    // ── 6. Call Groq LLM ──────────────────────────────────────────────────────
    const context = retrievedRules.map(r => `[${r.id}] ${r.law} ${r.article} (${r.country}): ${r.text_en}`).join("\n\n");
    const prompt = buildRAGPrompt(question, context);
    const llmRes = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      console.error("[query] Groq error:", errText);
      return NextResponse.json({ error: "LLM call failed" }, { status: 502 });
    }

    const llmData = await llmRes.json();
    const answer: string = llmData.choices?.[0]?.message?.content ?? "";

    // ── 7. Extract [rule_id] citations from answer ────────────────────────────
    const citedIds = new Set<string>(
      [...answer.matchAll(/\[([A-Z]{2,5}-[A-Z0-9-]+)\]/g)].map((m) => m[1])
    );

    const citations: Citation[] = retrievedRules
      .filter((r) => citedIds.has(r.id))
      .map((r) => ({
        rule_id: r.id,
        country: r.country,
        law: r.law,
        article: r.article,
        text_en: r.text_en,
        source_url: r.source_url,
        effective_date: r.effective_date,
        source_authority: r.source_authority,
        requirement_type: r.requirement_type,
      }));

    // ── 7B. LLM refusal detection ─────────────────────────────────────────────
    // Critical anti-hallucination guard: if the LLM produced no citations,
    // the vector matches were not truly relevant. Return a transparent
    // rejection with deterministic 0% confidence — never let the UI display
    // a high score that the evidence doesn't support.
    if (citations.length === 0) {
      return NextResponse.json({
        answer:
          "No rule found in current database for this query. " +
          `(Best match score: ${topScore.toFixed(3)}, threshold: ${SIMILARITY_THRESHOLD})`,
        citations: [],
        confidence: 0,
        retrievedCount: relevant.length,
        citedCount: 0,
        topScore: parseFloat(topScore.toFixed(3)),
        threshold: SIMILARITY_THRESHOLD,
        _debug: {
          topMatches: scored.slice(0, 5).map((s) => ({
            id: s.row.id,
            score: parseFloat(s.score.toFixed(4)),
          })),
          note: "LLM produced no citations — vector matches found but not truly relevant",
        },
      });
    }

    // ── 8. Confidence Score (based on cited rules only) ───────────────────────
    // Critical design: confidence is computed from rules the LLM actually
    // cited, not from rules merely retrieved by vector similarity. This
    // ensures the score reflects what the user sees (citations), not what
    // the system internally searched (retrieved candidates).
    const citedRules = retrievedRules.filter((r) => citedIds.has(r.id));
    const confidence = computeConfidenceScore(citedRules);

    return NextResponse.json({
      answer,
      citations,
      confidence: Math.round(confidence * 100),
      retrievedCount: relevant.length,
      citedCount: citations.length,
      topScore: parseFloat(topScore.toFixed(3)),
      threshold: SIMILARITY_THRESHOLD,
      // Debug info (remove in production if desired)
      _debug: {
        topMatches: scored.slice(0, 5).map((s) => ({
          id: s.row.id,
          score: parseFloat(s.score.toFixed(4)),
        })),
      },
    });
  } catch (err) {
    console.error("[query] unhandled error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
