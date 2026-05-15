'use client'
import { useState } from 'react'
import { ComplianceAdvice } from '@/lib/types'
import CitationSidebar from '../components/CitationSidebar'
import dynamic from 'next/dynamic'

const ExportPDF = dynamic(() => import('../components/ExportPDF'), { ssr: false })

const COUNTRIES = ['CN', 'JP', 'KR', 'TH', 'VN', 'SG', 'IN', 'ID', 'AU', 'MY', 'PH', 'NZ']
const DATA_TYPES = ['personal data', 'user behavioral data', 'financial data', 'health data', 'biometric data', 'employee data']

export default function AdvisorPage() {
  const [from, setFrom] = useState('TH')
  const [to, setTo] = useState('CN')
  const [dataType, setDataType] = useState('personal data')
  const [result, setResult] = useState<ComplianceAdvice | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeCite, setActiveCite] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  const submit = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_country: from, to_country: to, data_type: dataType }),
      })
      setResult(await res.json())
      setGeneratedAt(new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      }))
    } finally {
      setLoading(false)
    }
  }

  const riskColor = result?.risk_level === 'HIGH'
    ? 'risk-HIGH' : result?.risk_level === 'MEDIUM'
    ? 'risk-MEDIUM' : 'risk-LOW'

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compliance Advisor</h1>
        <p className="text-slate-400">Describe a data transfer scenario. Get structured compliance requirements, risk assessment, and verified legal citations.</p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-500">FROM COUNTRY</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
              value={from} onChange={(e) => setFrom(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500">TO COUNTRY (destination law applies)</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
              value={to} onChange={(e) => setTo(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">DATA TYPE</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
            value={dataType} onChange={(e) => setDataType(e.target.value)}>
            {DATA_TYPES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <button className="btn-primary w-full" onClick={submit} disabled={loading}>
          {loading ? 'Analysing...' : `Analyse Transfer: ${from} → ${to}`}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Risk Level */}
          <div className={`card border ${riskColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 mb-1">RISK ASSESSMENT</div>
                <div className="text-2xl font-bold">{result.risk_level} RISK</div>
                <div className="text-sm text-slate-400 mt-1">{from} → {to} · {dataType}</div>
                {generatedAt && (
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <span>🕐</span> Generated: {generatedAt}
                  </div>
                )}
              </div>
              <div className="text-4xl">{result.risk_level === 'HIGH' ? '🔴' : result.risk_level === 'MEDIUM' ? '🟡' : '🟢'}</div>
            </div>
          </div>

          {/* Export button */}
          <div className="flex justify-end">
            <ExportPDF advice={result} fromCountry={from} toCountry={to} dataType={dataType} />
          </div>

          {/* AI Summary */}
          <div className="card">
            <div className="text-xs text-slate-500 mb-2">AI COMPLIANCE SUMMARY</div>
            <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
          </div>

          {/* Required Steps */}
          {result.required_steps.length > 0 && (
            <div className="card">
              <div className="text-xs text-slate-500 mb-3">MANDATORY REQUIREMENTS ({result.required_steps.length})</div>
              <div className="space-y-3">
                {result.required_steps.map((step, i) => (
                  <div key={step.rule_id} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-900 text-red-300 text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</div>
                    <div>
                      <button className="citation-pill mb-1" onClick={() => setActiveCite(step.rule_id)}>{step.rule_id}</button>
                      <div className="text-xs text-slate-500">{step.law} · {step.article}</div>
                      <div className="text-sm text-slate-300 mt-1">{step.requirement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Citations */}
          <div className="card">
            <div className="text-xs text-slate-500 mb-2">ALL SOURCES ({result.citations.length})</div>
            <div className="flex flex-wrap gap-2">
              {result.citations.map((c) => (
                <button key={c.rule_id} className="citation-pill" onClick={() => setActiveCite(c.rule_id)}>
                  {c.rule_id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <CitationSidebar citations={result?.citations || []} active={activeCite} onClose={() => setActiveCite(null)} />
    </div>
  )
}
