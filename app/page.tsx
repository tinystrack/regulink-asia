import Link from 'next/link'

const COUNTRIES = [
  { code: 'CN', name: 'China', law: 'PIPL + DSL', level: 5 },
  { code: 'VN', name: 'Vietnam', law: 'Decree 13/2023', level: 4 },
  { code: 'IN', name: 'India', law: 'DPDP 2023', level: 3 },
  { code: 'ID', name: 'Indonesia', law: 'PDP Law 2022', level: 3 },
  { code: 'KR', name: 'South Korea', law: 'PIPA 2023', level: 3 },
  { code: 'TH', name: 'Thailand', law: 'PDPA', level: 3 },
  { code: 'JP', name: 'Japan', law: 'APPI 2022', level: 2 },
  { code: 'SG', name: 'Singapore', law: 'PDPA 2021', level: 2 },
  { code: 'AU', name: 'Australia', law: 'Privacy Act 1988', level: 2 },
  { code: 'MY', name: 'Malaysia', law: 'PDPA 2010', level: 2 },
  { code: 'PH', name: 'Philippines', law: 'Data Privacy Act', level: 3 },
  { code: 'NZ', name: 'New Zealand', law: 'Privacy Act 2020', level: 2 },
]

const LEVEL_COLOR = ['', 'bg-green-900 text-green-300', 'bg-green-800 text-green-200', 'bg-yellow-900 text-yellow-300', 'bg-orange-900 text-orange-300', 'bg-red-900 text-red-300']
const LEVEL_LABEL = ['', 'Open', 'Moderate', 'Conditional', 'Strict', 'Very Strict']

const FEATURES = [
  { icon: '🔍', title: 'Evidence-Based Query', desc: 'Ask any question about APAC digital trade regulations. Every answer cites the exact legal article and source URL.', href: '/query' },
  { icon: '⚖️', title: 'Regulatory Diff Engine', desc: 'Compare two jurisdictions side-by-side across 10 regulatory dimensions. Database-driven, not AI-generated.', href: '/diff' },
  { icon: '🛡️', title: 'Compliance Advisor', desc: 'Input a transfer scenario. Get structured compliance steps, risk level, and verified citations — deterministically computed.', href: '/advisor' },
  { icon: '🗺️', title: 'Explainable Map', desc: 'Visual overview of data governance strictness across Asia-Pacific, with RCEP/CPTPP membership indicators.', href: '/map' },
]

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center pt-8 pb-4 space-y-6">
        <div className="inline-flex items-center gap-2 bg-sky-900/40 border border-sky-700 text-sky-300 text-sm px-4 py-1.5 rounded-full">
          <span>🏆</span> UNESCAP AI Hackathon 2026 · Open Source
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Asia-Pacific Digital Trade<br />
          <span className="text-sky-400">Regulation Intelligence</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Every answer traceable to the exact legal text. Evidence-based AI analysis across 12 jurisdictions — built for governments, SMEs, and researchers.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/query" className="btn-primary text-base px-6 py-3">Ask a Question →</Link>
          <Link href="/advisor" className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-base">Try Compliance Advisor</Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Four Modules, One Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="card hover:border-sky-700 transition-colors group">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-center">Coverage</h2>
        <p className="text-slate-500 text-center mb-6 text-sm">12 jurisdictions · 104 verified legal rules · 10 regulatory dimensions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COUNTRIES.map((c) => (
            <div key={c.code} className="card text-center space-y-2 py-4">
              <div className="font-bold text-lg">{c.code}</div>
              <div className="text-slate-400 text-xs">{c.name}</div>
              <div className="text-slate-500 text-xs">{c.law}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLOR[c.level]}`}>
                {LEVEL_LABEL[c.level]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SDG */}
      <section className="card border-sky-900 bg-sky-950/20">
        <h2 className="font-semibold text-lg mb-4 text-sky-300">UN Sustainable Development Goals</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { sdg: 'SDG 8', label: 'Decent Work & Economic Growth', desc: 'Enabling digital trade for SMEs across APAC' },
            { sdg: 'SDG 9', label: 'Industry, Innovation & Infrastructure', desc: 'Open-source regulatory infrastructure for all' },
            { sdg: 'SDG 16', label: 'Peace, Justice & Strong Institutions', desc: 'Transparent, accountable, evidence-based policy tools' },
          ].map((s) => (
            <div key={s.sdg} className="space-y-1">
              <div className="text-sky-400 font-bold">{s.sdg}</div>
              <div className="text-sm font-medium">{s.label}</div>
              <div className="text-slate-500 text-xs">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
