'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/query', label: 'Query' },
  { href: '/diff', label: 'Compare' },
  { href: '/advisor', label: 'Advisor' },
  { href: '/map', label: 'Map' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-sky-400 text-lg tracking-tight">
          ReguLink <span className="text-slate-400 font-normal">Asia</span>
        </Link>
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                path === l.href
                  ? 'bg-sky-900 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
