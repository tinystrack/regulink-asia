import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { buildRAGPrompt } from '@/lib/prompt'
import { Citation, QueryResponse } from '@/lib/types'

const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

const AUTHORITY_SCORE: Record<string, number> = {
  official_law: 1.0,
  official_amendment: 0.9,
  ministry_guideline: 0.7,
  paraphrase: 0.5,
}

function computeConfidence(rules: any[]): number {
  if (rules.length === 0) return 0
  const authorityScore = rules.reduce((sum, r) => sum + (AUTHORITY_SCORE[r.source_authority] || 0.5), 0) / rules.length
  const coverageScore = Math.min(rules.length / 5, 1.0)
  const mandatoryBonus = rules.some(r => r.requirement_type === 'mandatory') ? 0.05 : 0
  const raw = authorityScore * 0.6 + coverageScore * 0.35 + mandatoryBonus
  return Math.round(Math.min(raw, 0.99) * 100)
}

async function searchRules(question: string, countryFilter?: string) {
  const keywords = question
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(' ')
    .filter((w) => w.length > 3)
    .slice(0, 6)

  const dimensionMap: Record<string, string> = {
    transfer: 'cross_border_transfer',
    'cross-border': 'cross_border_transfer',
    crossborder: 'cross_border_transfer',
    locali: 'data_localisation',
    storage: 'data_localisation',
    consent: 'consent',
    security: 'security_assessment',
    breach: 'breach_notification',
    notification: 'breach_notification',
    rights: 'data_subject_rights',
    access: 'data_subject_rights',
    deletion: 'data_subject_rights',
    retention: 'retention',
  }

  const detectedDimensions = new Set<string>()
  for (const kw of keywords) {
    for (const [key, dim] of Object.entries(dimensionMap)) {
      if (kw.includes(key)) detectedDimensions.add(dim)
    }
  }

  let query = 'SELECT * FROM rules WHERE 1=1'
  const params: string[] = []

  if (countryFilter) {
    const countries = countryFilter.toUpperCase().split(',').map((c) => c.trim()).filter(Boolean)
    if (countries.length > 0) {
      query += ` AND country IN (${countries.map(() => '?').join(',')})`
      params.push(...countries)
    }
  }

  if (detectedDimensions.size > 0) {
    const dims = Array.from(detectedDimensions)
    query += ` AND dimension IN (${dims.map(() => '?').join(',')})`
    params.push(...dims)
  }

  query += ' ORDER BY source_authority ASC LIMIT 8'

  const [rows] = await pool.execute(query, params) as any[]
  return rows
}

export async function POST(req: NextRequest) {
  try {
    const { question, countries } = await req.json()

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    const rules = await searchRules(question, countries)

    const confidence = computeConfidence(rules as any[])

    if (rules.length === 0) {
      return NextResponse.json({
        answer: 'No rule found in current database for this query. The database currently covers CN, JP, KR, TH, VN, SG, IN, ID, RCEP, and CPTPP regulations.',
        citations: [],
        confidence: 0,
      })
    }

    const context = rules
      .map((r: any) => `[${r.id}] ${r.law} ${r.article} (${r.country}): ${r.text_en}`)
      .join('\n\n')

    const prompt = buildRAGPrompt(question, context)

    const aiRes = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://regulink.tinystrack.com',
        'X-Title': 'ReguLink Asia',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.1,
      }),
    })

    if (!aiRes.ok) {
      const err = await aiRes.text()
      console.error('AI API error:', err)
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 })
    }

    const aiData = await aiRes.json()
    const answer = aiData.choices?.[0]?.message?.content || 'No response from AI.'

    const citedIds = [...new Set([...answer.matchAll(/\[([A-Z]{2,6}-[A-Z0-9-]+)\]/g)].map((m: any) => m[1]))]

    const citations: Citation[] = rules
      .filter((r: any) => citedIds.includes(r.id))
      .map((r: any) => ({
        rule_id: r.id,
        country: r.country,
        law: r.law,
        article: r.article,
        text_en: r.text_en.substring(0, 300) + (r.text_en.length > 300 ? '...' : ''),
        source_url: r.source_url,
        source_authority: r.source_authority,
        effective_date: r.effective_date,
      }))

    return NextResponse.json({ answer, citations, confidence })
  } catch (err) {
    console.error('Query error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
