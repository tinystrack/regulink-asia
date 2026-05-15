'use client'
import { useState } from 'react'

const COUNTRIES = ['CN', 'JP', 'KR', 'TH', 'VN', 'SG', 'IN', 'ID', 'AU', 'MY', 'PH', 'NZ', 'RCEP', 'CPTPP']
const DIMENSIONS: Record<string, string> = {
  cross_border_transfer: 'Cross-Border Transfer',
  data_localisation: 'Data Localisation',
  consent: 'Consent',
  security_assessment: 'Security Assessment',
  breach_notification: 'Breach Notification',
  data_subject_rights: 'Data Subject Rights',
  retention: 'Retention',
  privacy_policy: 'Privacy Policy',
}

const TYPE_STYLE: Record<string, string> = {
  mandatory: 'bg-red-900/40 text-red-300 border border-red-800',
  conditional: 'bg-yellow-900/40 text-yellow-300 border border-yellow-800',
  voluntary: 'bg-green-900/40 text-green-300 border border-green-800',
  not_regulated: 'bg-slate-800 text-slate-400 border border-slate-700',
  prohibited: 'bg-indigo-900/40 text-indigo-300 border border-indigo-800',
}

const TYPE_RANK: Record<string, number> = {
  mandatory: 5, conditional: 4, voluntary: 3, not_regulated: 1, prohibited: 2
}

function parseMechanism(val: any): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return [] }
  }
  return []
}

function ConflictBadge({ a, b }: { a?: string; b?: string }) {
  if (!a || !b) return null
  if (a === b) return <span className="text-xs text-green-500">✓ Aligned</span>
  return <span className="text-xs text-amber-400">⚠ Differs</span>
}

function CountryCell({ data }: { data: any }) {
  if (!data) return <span className="text-slate-600 text-xs">No data</span>
  const mechanisms = parseMechanism(data.mechanism)
  return (
    <div className="space-y-1">
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${TYPE_STYLE[data.requirement_type] || ''}`}>
        {data.requirement_type}
      </span>
      <div className="text-xs text-slate-500">{data.article}</div>
      {mechanisms.slice(0, 2).map((m: string) => (
        <span key={m} className="inline-block text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded mr-1">
          {m.replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  )
}

function buildConflictSummary(diff: any[], ca: string, cb: string): string {
  if (!diff || diff.length === 0) return ''

  const conflicts = diff.filter(r => r.country_a && r.country_b && r.country_a.requirement_type !== r.country_b.requirement_type)
  const gaps = diff.filter(r => (r.country_a && !r.country_b) || (!r.country_a && r.country_b))
  const aligned = diff.filter(r => r.country_a && r.country_b && r.country_a.requirement_type === r.country_b.requirement_type)

  const stricterA = diff.filter(r => r.country_a && r.country_b &&
    (TYPE_RANK[r.country_a.requirement_type] || 0) > (TYPE_RANK[r.country_b.requirement_type] || 0)
  )
  const stricterB = diff.filter(r => r.country_a && r.country_b &&
    (TYPE_RANK[r.country_b.requirement_type] || 0) > (TYPE_RANK[r.country_a.requirement_type] || 0)
  )

  const lines: string[] = []

  lines.push(`${ca} and ${cb} share ${aligned.length} aligned dimension${aligned.length !== 1 ? 's' : ''} and differ on ${conflicts.length + gaps.length}.`)

  if (stricterA.length > 0) {
    const dims = stricterA.map(r => DIMENSIONS[r.dimension] || r.dimension).join(', ')
    lines.push(`${ca} imposes stricter requirements on: ${dims}.`)
  }
  if (stricterB.length > 0) {
    const dims = stricterB.map(r => DIMENSIONS[r.dimension] || r.dimension).join(', ')
    lines.push(`${cb} imposes stricter requirements on: ${dims}.`)
  }

  if (gaps.length > 0) {
    const gapDims = gaps.map(r => DIMENSIONS[r.dimension] || r.dimension).join(', ')
    lines.push(`Data gaps exist for: ${gapDims} — one jurisdiction has no rule in the current database.`)
  }

  const conflictDims = conflicts.filter(r => r.country_a && r.country_b)
  if (conflictDims.length > 0) {
    const worst = conflictDims.sort((a, b) =>
      Math.abs((TYPE_RANK[b.country_a.requirement_type] || 0) - (TYPE_RANK[b.country_b.requirement_type] || 0)) -
      Math.abs((TYPE_RANK[a.country_a.requirement_type] || 0) - (TYPE_RANK[a.country_b.requirement_type] || 0))
    )[0]
    lines.push(`Most significant gap: ${DIMENSIONS[worst.dimension] || worst.dimension} — ${ca} requires "${worst.country_a.requirement_type}" while ${cb} requires "${worst.country_b.requirement_type}".`)
  }

  lines.push('Companies operating across both jurisdictions must comply with the stricter standard in each dimension.')
  return lines.join(' ')
}

export default function DiffPage() {
  const [countryA, setCountryA] = useState('CN')
  const [countryB, setCountryB] = useState('TH')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const compare = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country_a: countryA, country_b: countryB }),
      })
      setResult(await res.json())
    } finally {
      setLoading(false)
    }
  }

  const summary = result?.diff ? buildConflictSummary(result.diff, result.country_a, result.country_b) : ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Regulatory Diff Engine</h1>
        <p className="text-slate-400">Structured comparison of regulatory requirements across jurisdictions. Database-driven — not AI-generated summaries.</p>
      </div>

      <div className="card flex flex-wrap gap-6 items-end">
        <div className="space-y-2">
          <label className="text-xs text-slate-500">JURISDICTION A</label>
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
            value={countryA}
            onChange={(e) => setCountryA(e.target.value)}
          >
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="text-slate-500 text-xl pb-2">vs</div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">JURISDICTION B</label>
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
            value={countryB}
            onChange={(e) => setCountryB(e.target.value)}
          >
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={compare} disabled={loading}>
          {loading ? 'Comparing...' : 'Compare →'}
        </button>
      </div>

      {summary && (
        <div className="card border-sky-900 bg-sky-950/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-sky-400">CONFLICT SUMMARY</span>
            <span className="text-xs text-slate-600 italic">deterministically computed from database — not AI-generated</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
        </div>
      )}

      {result?.diff && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium w-40">Dimension</th>
                <th className="text-left py-3 px-4 text-sky-400 font-semibold">{result.country_a}</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium w-24">Status</th>
                <th className="text-left py-3 px-4 text-sky-400 font-semibold">{result.country_b}</th>
              </tr>
            </thead>
            <tbody>
              {result.diff.map((row: any) => (
                <tr key={row.dimension} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-300 font-medium text-xs">
                    {DIMENSIONS[row.dimension] || row.dimension}
                  </td>
                  <td className="py-3 px-4"><CountryCell data={row.country_a} /></td>
                  <td className="py-3 px-4">
                    <ConflictBadge a={row.country_a?.requirement_type} b={row.country_b?.requirement_type} />
                  </td>
                  <td className="py-3 px-4"><CountryCell data={row.country_b} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
