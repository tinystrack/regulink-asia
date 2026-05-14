import type { Metadata } from 'next'
import './globals.css'
import Nav from './components/Nav'

export const metadata: Metadata = {
  title: 'ReguLink Asia — Asia-Pacific Digital Trade Regulation Intelligence',
  description: 'Evidence-based AI analysis of Asia-Pacific digital trade regulations with verified citations.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Nav />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-800 mt-16 py-6 text-center text-slate-500 text-sm">
          <p>ReguLink Asia · Open Source · Built for UNESCAP AI Hackathon 2026</p>
          <p className="mt-1">Data sourced from official government publications. Not legal advice.</p>
        </footer>
      </body>
    </html>
  )
}
