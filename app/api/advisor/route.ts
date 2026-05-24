// app/api/advisor/route.ts
// ReguLink Asia — Compliance Advisor
//
// Params: from_country, to_country, data_type
// Returns: ComplianceAdvice { risk_level, required_steps, citations, summary }
//
// Risk level is computed deterministically (no AI).
// AI is used only for a 3-sentence plain-language summary.

import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { ComplianceAdvice, Citation } from '@/lib/types'

const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const GROQ_API_KEY = process.env.GROQ_API_KEY! // Fix 1: explicit declaration, consistent with query/route.ts

// Shared citation text lengths
const STEP_TEXT_LIMIT = 200
const CITATION_TEXT_LIMIT = 300

export async function POST(req: NextRequest) {
  try {
    const { from_country, to_country, data_type } = await req.json()

    if (!from_country || !to_country) {
      return NextResponse.json(
        { error: 'from_country and to_country are required' },
        { status: 400 }
      )
    }

    const fc = from_country.toUpperCase()
    const tc = to_country.toUpperCase()

    // Fix 2: explicit column list — avoids returning large embedding float arrays
    const RULE_COLUMNS = `id, country, law, article, dimension, requirement_type,
                          mechanism, text_en, source_url, effective_date, source_authority`

    const [rules] = await pool.execute(
      `SELECT ${RULE_COLUMNS} FROM rules
       WHERE country = ? AND dimension IN ('cross_border_transfer', 'data_localisation', 'consent', 'security_assessment')
       ORDER BY source_authority ASC, requirement_type ASC`,
      [tc]
    ) as any[]

    const [regionalRules] = await pool.execute(
      `SELECT ${RULE_COLUMNS} FROM rules
       WHERE country IN ('RCEP', 'CPTPP') AND dimension = 'cross_border_transfer'`
    ) as any[]

    const allRules = [...(rules as any[]), ...(regionalRules as any[])]

    if (allRules.length === 0) {
      return NextResponse.json(
        { error: `No rules found for destination country: ${tc}` },
        { status: 404 }
      )
    }

    // Deterministic risk level (no AI)
    const mandatoryCount = (rules as any[]).filter((r: any) => r.requirement_type === 'mandatory').length
    const hasLocalisation = (rules as any[]).some(
      (r: any) => r.dimension === 'data_localisation' && r.requirement_type !== 'not_regulated'
    )
    const riskLevel = mandatoryCount >= 3 || hasLocalisation ? 'HIGH' : mandatoryCount >= 1 ? 'MEDIUM' : 'LOW'

    // Mandatory steps (uniform truncation length)
    const requiredSteps = (rules as any[])
      .filter((r: any) => r.requirement_type === 'mandatory')
      .map((r: any) => ({
        rule_id: r.id,
        law: r.law,
        article: r.article,
        requirement:
          r.text_en.length > STEP_TEXT_LIMIT
            ? r.text_en.substring(0, STEP_TEXT_LIMIT) + '...'
            : r.text_en,
      }))

    // Citations (uniform truncation length)
    const citations: Citation[] = allRules.map((r: any) => ({
      rule_id: r.id,
      country: r.country,
      law: r.law,
      article: r.article,
      text_en:
        r.text_en.length > CITATION_TEXT_LIMIT
          ? r.text_en.substring(0, CITATION_TEXT_LIMIT) + '...'
          : r.text_en,
      source_url: r.source_url,
    }))

    // AI summary (3 sentences, grounded in context only)
    const context = allRules
      .map((r: any) => `[${r.id}] ${r.law} ${r.article}: ${r.text_en}`)
      .join('\n\n')

    const prompt = `You are a compliance advisor. A company wants to transfer ${data_type || 'personal data'} from ${fc} to ${tc}.

Based ONLY on the following regulations, provide a concise 3-sentence compliance summary covering: (1) the key legal requirement, (2) the main mechanism required, (3) the primary risk.

REGULATIONS:
${context}

Do not introduce external knowledge. End with [rule_ids] for each sentence.

SUMMARY:`

    // Fix 3: use GROQ_API_KEY constant; HTTP-Referer from env only (no hardcoded old domain)
    const aiRes = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
        ...(process.env.NEXT_PUBLIC_APP_URL
          ? { 'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL }
          : {}),
        'X-Title': 'ReguLink Asia',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.1,
      }),
    })

    let summary = `Transfer of ${data_type || 'personal data'} from ${fc} to ${tc} is subject to ${mandatoryCount} mandatory requirements. Risk level: ${riskLevel}.`

    if (aiRes.ok) {
      const aiData = await aiRes.json()
      summary = aiData.choices?.[0]?.message?.content || summary
    }

    const advice: ComplianceAdvice = {
      risk_level: riskLevel as 'HIGH' | 'MEDIUM' | 'LOW',
      required_steps: requiredSteps,
      citations,
      summary,
    }

    return NextResponse.json(advice)
  } catch (err) {
    console.error('[advisor] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}