'use client'
import { useState } from 'react'
import CitationSidebar from '../components/CitationSidebar'

interface Citation {
  rule_id: string
  country: string
  law: string
  article: string
  text_en: string
  source_url: string
  source_authority?: string
  effective_date?: string
}

interface QueryResponse {
  answer: string
  citations: Citation[]
  confidence: number
}

interface HistoryItem {
  question: string
  confidence: number
  citationCount: number
  time: string
}

const EXAMPLES = [
  'What are the requirements for transferring personal data from Thailand to China?',
  'Does Vietnam require data localisation for tech companies?',
  'What is the breach notification deadline in South Korea?',
  'How does CPTPP restrict data localisation requirements?',
]

const COUNTRIES = ['CN', 'JP', 'KR', 'TH', 'VN', 'SG', 'IN', 'ID', 'RCEP', 'CPTPP']

const AUTHORITY_COLOR: Record<string, string> = {
  official_law: 'bg-green-900 text-green-300 border-green-700',
  official_amendment: 'bg-green-900/60 text-green-400 border-green-800',
  ministry_guideline: 'bg-yellow-900 text-yellow-300 border-yellow-700',
  paraphrase: 'bg-slate-700 text-slate-400 border-slate-600',
}

const AUTHORITY_LABEL: Record<string, string> = {
  official_law: 'Official Law',
  official_amendment: 'Amendment',
  ministry_guideline: 'Guideline',
  paraphrase: 'Paraphrase',
}

function ConfidenceMeter({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
  const label = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono font-bold text-slate-300 w-12">{score}%</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  )
}

function renderWithCitations(text: string, citations: Citation[], onCite: (id: string) => void) {
  const parts = text.split(/(\[[A-Z]{2,6}-[A-Z0-9-]+\])/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[([A-Z]{2,6}-[A-Z0-9-]+)\]$/)
    if (match) {
      const id = match[1]
      const found = citations.find((c) => c.rule_id === id)
      return (
        <button key={i} className="citation-pill mx-1" onClick={() => onCite(id)}>
          {found ? `${found.country} · ${found.article}` : id}
        </button>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function QueryPage() {
  const [question, setQuestion] = useState('')
  const [countries, setCountries] = useState<string[]>([])
  const [result, setResult] = useState<QueryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeCite, setActiveCite] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const toggleCountry = (c: string) =>
    setCountries((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])

  const submit = async (q?: string) => {
    const finalQ = q || question
    if (!finalQ.trim()) return
    if (q) setQuestion(q)
    setLoading(true)
    setResult(null)
    setActiveCite(null)
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: finalQ, countries: countries.join(',') || undefined }),
      })
      const data: QueryResponse = await res.json()
      setResult(data)
      setHistory(prev => [{
        question: finalQ,
        confidence: data.confidence || 0,
        citationCount: data.citations?.length || 0,
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 10))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6">
      {/* History sidebar */}
      {showHistory && (
        <div className="w-64 flex-shrink-0">
          <div className="card sticky top-20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400">QUERY HISTORY</span>
              <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white text-sm">×</button>
            </div>
            {history.length === 0 && <p className="text-xs text-slate-600">No queries yet.</p>}
            {history.map((h, i) => (
              <button key={i} onClick={() => submit(h.question)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors space-y-1 border border-transparent hover:border-slate-700">
                <div className="text-xs text-slate-300 line-clamp-2">{h.question}</div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{h.citationCount} sources · {h.confidence}%</span>
                  <span>{h.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 max-w-3xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Regulation Query</h1>
            <p className="text-slate-400">Ask any question. Every answer cites the exact legal article and official source.</p>
          </div>
          <button onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-sky-400 border border-slate-700 hover:border-sky-700 px-3 py-1.5 rounded-lg transition-colors">
            <span>🕐</span> History {history.length > 0 && <span className="bg-sky-900 text-sky-300 px-1.5 rounded-full">{history.length}</span>}
          </button>
        </div>

        <div className="card space-y-4">
          <textarea
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-sky-500 h-24"
            placeholder="e.g. What mechanisms are required for cross-border data transfer from Thailand?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) submit() }}
          />
          <div>
            <div className="text-xs text-slate-500 mb-2">FILTER BY JURISDICTION (optional — improves precision)</div>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button key={c} onClick={() => toggleCountry(c)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    countries.includes(c) ? 'border-sky-500 bg-sky-900 text-sky-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary" onClick={() => submit()} disabled={loading || !question.trim()}>
            {loading ? 'Searching...' : 'Search Regulations'}
          </button>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-2">EXAMPLE QUERIES</div>
          <div className="space-y-2">
            {EXAMPLES.map((e) => (
              <button key={e} onClick={() => submit(e)} className="block w-full text-left text-sm text-slate-400 hover:text-sky-400 transition-colors py-1">
                → {e}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="card space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Answer grounded in {result.citations.length} verified source{result.citations.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1.5">EVIDENCE CONFIDENCE</div>
                <ConfidenceMeter score={result.confidence} />
                <div className="text-xs text-slate-600 mt-1">Based on source authority levels and rule coverage — deterministically computed</div>
              </div>
            </div>

            <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
              {renderWithCitations(result.answer, result.citations, setActiveCite)}
            </div>

            {result.citations.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-2">SOURCES</div>
                <div className="flex flex-wrap gap-2">
                  {result.citations.map((c) => (
                    <button key={c.rule_id} onClick={() => setActiveCite(c.rule_id)}
                      className="flex items-center gap-1.5 group">
                      <span className="citation-pill">{c.rule_id}</span>
                      {c.source_authority && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${AUTHORITY_COLOR[c.source_authority] || AUTHORITY_COLOR['paraphrase']}`}>
                          {AUTHORITY_LABEL[c.source_authority] || c.source_authority}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <CitationSidebar citations={result?.citations || []} active={activeCite} onClose={() => setActiveCite(null)} />
      </div>
    </div>
  )
}
