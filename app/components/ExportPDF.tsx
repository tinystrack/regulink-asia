'use client'
import { useState } from 'react'
import { ComplianceAdvice } from '@/lib/types'

interface Props {
  advice: ComplianceAdvice
  fromCountry: string
  toCountry: string
  dataType: string
}

export default function ExportPDF({ advice, fromCountry, toCountry, dataType }: Props) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { createElement } = await import('react')
      const {
        Document, Page, Text, View, StyleSheet, Link
      } = await import('@react-pdf/renderer')

      const styles = StyleSheet.create({
        page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a2e' },
        header: { marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#0ea5e9', paddingBottom: 12 },
        title: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#0ea5e9', marginBottom: 4 },
        subtitle: { fontSize: 11, color: '#475569' },
        badge: { fontSize: 9, padding: '3 8', borderRadius: 4, marginTop: 6, alignSelf: 'flex-start' },
        badgeHigh: { backgroundColor: '#450a0a', color: '#f87171' },
        badgeMedium: { backgroundColor: '#451a03', color: '#fbbf24' },
        badgeLow: { backgroundColor: '#052e16', color: '#4ade80' },
        section: { marginTop: 16 },
        sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#64748b', marginBottom: 6, letterSpacing: 1 },
        summaryText: { fontSize: 10, lineHeight: 1.6, color: '#334155' },
        stepRow: { flexDirection: 'row', gap: 8, marginBottom: 10, padding: '8 10', backgroundColor: '#fef2f2', borderLeftWidth: 3, borderLeftColor: '#ef4444' },
        stepNum: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#ef4444', width: 16 },
        stepContent: { flex: 1 },
        stepId: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0ea5e9', marginBottom: 2 },
        stepLaw: { fontSize: 8, color: '#64748b', marginBottom: 2 },
        stepText: { fontSize: 9, color: '#374151', lineHeight: 1.5 },
        citationRow: { marginBottom: 8, padding: '8 10', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
        citationId: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#0ea5e9', marginBottom: 2 },
        citationMeta: { fontSize: 8, color: '#64748b', marginBottom: 3 },
        citationText: { fontSize: 8, color: '#374151', lineHeight: 1.5, marginBottom: 3 },
        citationUrl: { fontSize: 7, color: '#0ea5e9' },
        footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
        footerText: { fontSize: 8, color: '#94a3b8' },
        metaRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
        metaItem: { fontSize: 9, color: '#475569' },
        metaLabel: { fontFamily: 'Helvetica-Bold', color: '#334155' },
      })

      const riskBadgeStyle = advice.risk_level === 'HIGH' ? styles.badgeHigh : advice.risk_level === 'MEDIUM' ? styles.badgeMedium : styles.badgeLow

      const doc = createElement(Document, {},
        createElement(Page, { size: 'A4', style: styles.page },
          // Header
          createElement(View, { style: styles.header },
            createElement(Text, { style: styles.title }, 'ReguLink Asia — Compliance Report'),
            createElement(Text, { style: styles.subtitle }, `Cross-Border Data Transfer Analysis · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`),
            createElement(View, { style: styles.metaRow },
              createElement(Text, { style: styles.metaItem },
                createElement(Text, { style: styles.metaLabel }, 'Transfer: '), `${fromCountry} -> ${toCountry}`
              ),
              createElement(Text, { style: styles.metaItem },
                createElement(Text, { style: styles.metaLabel }, 'Data Type: '), dataType
              ),
              createElement(Text, { style: styles.metaItem },
                createElement(Text, { style: styles.metaLabel }, 'Generated: '), new Date().toISOString()
              ),
            ),
            createElement(View, { style: [styles.badge, riskBadgeStyle] },
              createElement(Text, {}, `RISK LEVEL: ${advice.risk_level}`)
            ),
          ),

          // Summary
          createElement(View, { style: styles.section },
            createElement(Text, { style: styles.sectionTitle }, 'AI COMPLIANCE SUMMARY'),
            createElement(Text, { style: styles.summaryText }, advice.summary.replace(/\[[^\]]+\]/g, ''))
          ),

          // Required Steps
          createElement(View, { style: styles.section },
            createElement(Text, { style: styles.sectionTitle }, `MANDATORY REQUIREMENTS (${advice.required_steps.length})`),
            ...advice.required_steps.map((step, i) =>
              createElement(View, { key: i, style: styles.stepRow },
                createElement(Text, { style: styles.stepNum }, `${i + 1}.`),
                createElement(View, { style: styles.stepContent },
                  createElement(Text, { style: styles.stepId }, step.rule_id),
                  createElement(Text, { style: styles.stepLaw }, `${step.law} · ${step.article}`),
                  createElement(Text, { style: styles.stepText }, step.requirement),
                )
              )
            ),
          ),

          // Footer
          createElement(View, { style: styles.footer },
            createElement(Text, { style: styles.footerText }, 'ReguLink Asia · Open Source · Built for UNESCAP AI Hackathon 2026'),
            createElement(Text, { style: styles.footerText }, 'Data sourced from official government publications. Not legal advice.'),
          ),
        ),

        // Page 2: Citations
        createElement(Page, { size: 'A4', style: styles.page },
          createElement(View, { style: styles.header },
            createElement(Text, { style: styles.title }, 'Source Citations'),
            createElement(Text, { style: styles.subtitle }, `${advice.citations.length} verified legal sources · All sourced from official government publications`),
          ),
          createElement(View, { style: styles.section },
            createElement(Text, { style: styles.sectionTitle }, 'VERIFIED CITATIONS'),
            ...advice.citations.map((c, i) =>
              createElement(View, { key: i, style: styles.citationRow },
                createElement(Text, { style: styles.citationId }, c.rule_id),
                createElement(Text, { style: styles.citationMeta }, `${c.country} · ${c.law} · ${c.article}`),
                createElement(Text, { style: styles.citationText }, `"${c.text_en}"`),
                createElement(Link, { style: styles.citationUrl, src: c.source_url }, c.source_url),
              )
            ),
          ),
          createElement(View, { style: styles.footer },
            createElement(Text, { style: styles.footerText }, 'ReguLink Asia · Open Source · Built for UNESCAP AI Hackathon 2026'),
            createElement(Text, { style: styles.footerText }, 'Not legal advice. Verify all citations at the official sources above.'),
          ),
        )
      )

      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `regulink-compliance-${fromCountry}-to-${toCountry}-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF error:', err)
      alert('PDF export failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-sky-500 hover:text-sky-300 transition-colors text-sm disabled:opacity-50"
    >
      {loading ? (
        <><span className="animate-spin">⏳</span> Generating PDF...</>
      ) : (
        <><span>📄</span> Export PDF Report</>
      )}
    </button>
  )
}
