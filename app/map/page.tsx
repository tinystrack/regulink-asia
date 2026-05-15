'use client'
import { useState } from 'react'

const COUNTRIES = [
  {
    code: 'CN', name: 'China', strictness: 5, localisation: 'mandatory',
    rcep: true, cptpp: false,
    summary: 'China has the strictest data governance in APAC. PIPL requires security assessment for most cross-border transfers. Critical infrastructure operators must localise data domestically.',
    law: 'PIPL + DSL + CBDT 2024',
  },
  {
    code: 'VN', name: 'Vietnam', strictness: 4, localisation: 'conditional',
    rcep: true, cptpp: false,
    summary: 'Vietnam Decree 13/2023 requires Ministry of Public Security notification for all cross-border transfers. Tech companies must store Vietnamese user data locally.',
    law: 'Decree 13/2023',
  },
  {
    code: 'IN', name: 'India', strictness: 3, localisation: 'none',
    rcep: false, cptpp: false,
    summary: 'India DPDP 2023 removed blanket localisation. Cross-border transfers require government-approved destination countries. Rules still being notified.',
    law: 'DPDP Act 2023',
  },
  {
    code: 'ID', name: 'Indonesia', strictness: 3, localisation: 'conditional',
    rcep: true, cptpp: false,
    summary: 'Indonesia PDP Law 2022 requires strategic data to be stored locally. Cross-border transfers need minister notification and adequate protection standard.',
    law: 'PDP Law 2022',
  },
  {
    code: 'KR', name: 'South Korea', strictness: 3, localisation: 'none',
    rcep: true, cptpp: true,
    summary: 'Korea PIPA 2023 aligns with GDPR standards. Cross-border transfers require consent or adequacy decision. No general localisation requirement.',
    law: 'PIPA 2023',
  },
  {
    code: 'TH', name: 'Thailand', strictness: 3, localisation: 'none',
    rcep: true, cptpp: false,
    summary: 'Thailand PDPA mirrors GDPR structure. Transfers require comparable protection in destination. No data localisation mandate. Breach notification within 72 hours.',
    law: 'PDPA B.E. 2562',
  },
  {
    code: 'JP', name: 'Japan', strictness: 2, localisation: 'none',
    rcep: true, cptpp: true,
    summary: 'Japan APPI 2022 requires consent or adequacy for cross-border transfers. Strong data subject rights. DFFT (Data Free Flow with Trust) champion.',
    law: 'APPI 2022',
  },
  {
    code: 'SG', name: 'Singapore', strictness: 2, localisation: 'none',
    rcep: true, cptpp: true,
    summary: 'Singapore PDPA is business-friendly. Comparable protection standard for transfers. Data portability right added in 2021. No localisation requirement.',
    law: 'PDPA 2021',
  },
  {
    code: 'AU', name: 'Australia', strictness: 2, localisation: 'none',
    rcep: false, cptpp: true,
    summary: 'Australia Privacy Act 1988 (amended 2022) requires cross-border transfers to countries with comparable protection. No general localisation. Strong enforcement by OAIC.',
    law: 'Privacy Act 1988',
  },
  {
    code: 'MY', name: 'Malaysia', strictness: 2, localisation: 'none',
    rcep: true, cptpp: false,
    summary: 'Malaysia PDPA 2010 prohibits cross-border transfers unless destination has comparable protection. Under review for 2024 amendments. No localisation requirement.',
    law: 'PDPA 2010',
  },
  {
    code: 'PH', name: 'Philippines', strictness: 3, localisation: 'none',
    rcep: true, cptpp: false,
    summary: 'Philippines Data Privacy Act 2012 requires adequate protection for cross-border transfers. NPC approval may be required. No general localisation mandate.',
    law: 'Data Privacy Act 2012',
  },
  {
    code: 'NZ', name: 'New Zealand', strictness: 2, localisation: 'none',
    rcep: false, cptpp: true,
    summary: 'New Zealand Privacy Act 2020 requires comparable safeguards for cross-border transfers. Business-friendly regime. No localisation requirement. Strong GDPR alignment.',
    law: 'Privacy Act 2020',
  },
]

const STRICTNESS_COLOR = [
  '', 'bg-green-600', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'
]
const STRICTNESS_LABEL = ['', 'Open', 'Moderate', 'Conditional', 'Strict', 'Very Strict']

export default function MapPage() {
  const [selected, setSelected] = useState<typeof COUNTRIES[0] | null>(null)
  const [sortBy, setSortBy] = useState<'strictness' | 'name'>('strictness')

  const sorted = [...COUNTRIES].sort((a, b) =>
    sortBy === 'strictness' ? b.strictness - a.strictness : a.name.localeCompare(b.name)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Regulatory Map</h1>
        <p className="text-slate-400">Data governance strictness across Asia-Pacific. Click a jurisdiction for details.</p>
      </div>

      <div className="flex gap-3 items-center">
        <span className="text-xs text-slate-500">SORT BY:</span>
        {(['strictness', 'name'] as const).map((s) => (
          <button key={s} onClick={() => setSortBy(s)} className={`text-xs px-3 py-1 rounded-full border transition-colors capitalize ${sortBy === s ? 'border-sky-500 bg-sky-900 text-sky-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>{s}</button>
        ))}
        <div className="ml-auto flex gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>RCEP member</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>CPTPP member</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sorted.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelected(selected?.code === c.code ? null : c)}
            className={`card text-left transition-all hover:border-sky-600 ${selected?.code === c.code ? 'border-sky-500 bg-sky-950/30' : ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg">{c.code}</span>
              <div className="flex gap-1">
                {c.rcep && <span className="w-2 h-2 rounded-full bg-sky-500 mt-1"></span>}
                {c.cptpp && <span className="w-2 h-2 rounded-full bg-purple-500 mt-1"></span>}
              </div>
            </div>
            <div className="text-slate-400 text-xs mb-3">{c.name}</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((n) => (
                  <div key={n} className={`w-3 h-3 rounded-sm ${n <= c.strictness ? STRICTNESS_COLOR[c.strictness] : 'bg-slate-700'}`}></div>
                ))}
              </div>
              <span className="text-xs text-slate-400">{STRICTNESS_LABEL[c.strictness]}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Localisation: <span className={c.localisation !== 'none' ? 'text-orange-400' : 'text-green-400'}>{c.localisation}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="card border-sky-800 bg-sky-950/20 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{selected.name} <span className="text-slate-500 text-lg">({selected.code})</span></h2>
              <div className="text-sky-400 text-sm mt-1">{selected.law}</div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-xl">×</button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-slate-500 mb-1">STRICTNESS</div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((n) => (
                    <div key={n} className={`w-4 h-4 rounded-sm ${n <= selected.strictness ? STRICTNESS_COLOR[selected.strictness] : 'bg-slate-700'}`}></div>
                  ))}
                </div>
                <span className="font-medium">{STRICTNESS_LABEL[selected.strictness]}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">DATA LOCALISATION</div>
              <div className={`font-medium capitalize ${selected.localisation !== 'none' ? 'text-orange-400' : 'text-green-400'}`}>{selected.localisation}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">TRADE AGREEMENTS</div>
              <div className="flex gap-2">
                {selected.rcep && <span className="text-xs bg-sky-900 text-sky-300 px-2 py-0.5 rounded">RCEP</span>}
                {selected.cptpp && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded">CPTPP</span>}
                {!selected.rcep && !selected.cptpp && <span className="text-slate-500 text-xs">None tracked</span>}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-2">AI SUMMARY</div>
            <p className="text-sm text-slate-300 leading-relaxed">{selected.summary}</p>
          </div>
        </div>
      )}

      <div className="card text-xs text-slate-500 space-y-1">
        <div className="font-medium text-slate-400 mb-2">Methodology</div>
        <p>Strictness scores are derived from the number of mandatory requirements in each jurisdiction's RuleNode database across dimensions: cross-border transfer, data localisation, consent, security assessment, and breach notification. Scores are not AI-generated — they reflect structured data queries. Source authority: official_law &gt; official_amendment &gt; ministry_guideline.</p>
      </div>
    </div>
  )
}
