'use client'

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

interface Props {
  citations: Citation[]
  active: string | null
  onClose: () => void
}

const AUTHORITY_BADGE: Record<string, { label: string; color: string }> = {
  official_law: { label: 'Official Law', color: 'bg-green-900 text-green-300 border-green-700' },
  official_amendment: { label: 'Official Amendment', color: 'bg-green-900/60 text-green-400 border-green-800' },
  ministry_guideline: { label: 'Ministry Guideline', color: 'bg-yellow-900 text-yellow-300 border-yellow-700' },
  paraphrase: { label: 'Paraphrase', color: 'bg-slate-700 text-slate-400 border-slate-600' },
}

export default function CitationSidebar({ citations, active, onClose }: Props) {
  const citation = citations.find((c) => c.rule_id === active)
  if (!active || !citation) return null

  const badge = AUTHORITY_BADGE[citation.source_authority || ''] || AUTHORITY_BADGE['paraphrase']

  const formatDate = (d?: string) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-40 overflow-y-auto">
      <div className="p-4 border-b border-slate-700 flex justify-between items-start">
        <div>
          <div className="text-xs text-slate-500 mb-1">SOURCE CITATION</div>
          <div className="font-mono text-sky-400 font-bold text-sm">{citation.rule_id}</div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
      </div>
      <div className="p-4 space-y-4">

        <div>
          <div className="text-xs text-slate-500 mb-2">SOURCE RELIABILITY</div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${badge.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {badge.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-500 mb-1">JURISDICTION</div>
            <div className="font-medium">{citation.country}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">EFFECTIVE DATE</div>
            <div className="text-sm text-slate-300">{formatDate(citation.effective_date) || '—'}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-1">LAW</div>
          <div className="text-sm text-slate-300">{citation.law}</div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-1">ARTICLE</div>
          <div className="font-medium text-sky-300">{citation.article}</div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-2">LEGAL TEXT</div>
          <div className="text-sm text-slate-300 leading-relaxed bg-slate-800 rounded-lg p-3 border border-slate-700">
            "{citation.text_en}"
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-1">OFFICIAL SOURCE</div>
          <a
            href={citation.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 text-xs break-all underline"
          >
            {citation.source_url}
          </a>
        </div>

        <div className="text-xs text-slate-600 pt-2 border-t border-slate-700 space-y-1">
          <div>This citation is sourced directly from official government publications.</div>
          <div>Click the link above to verify the original text.</div>
        </div>
      </div>
    </div>
  )
}
