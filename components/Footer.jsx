'use client'

import Link from 'next/link'

const LINKS = [
  { label: 'New Drop',             href: '/shop' },
  { label: 'Our Story',            href: '/story' },
  { label: 'Transform Your Saree', href: '/transform' },
  { label: 'StyleOut AI',          href: '/styleout' },
]

export default function Footer() {
  return (
    <footer className="bg-aapta-warm border-t border-aapta-gold/30">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

        <div>
          <div className="font-serif font-light text-aapta-ink uppercase mb-1"
            style={{ fontSize: '1.6rem', letterSpacing: '0.45em', fontWeight: 400 }}>
            AAPTA
          </div>
          <div className="font-serif italic text-aapta-gold mb-4"
            style={{ fontSize: '0.65rem', letterSpacing: '0.3em' }}>
            आप्त
          </div>
          <p className="text-aapta-muted text-xs leading-7 max-w-[200px]">
            Your mother's saree deserves a second life. Made in India, one piece at a time.
          </p>
        </div>

        <div>
          <p className="sec-label mb-5">Navigate</p>
          <nav className="flex flex-col gap-3">
            {LINKS.map(({ label, href }) => (
              <Link key={label} href={href}
                className="text-xs text-aapta-muted hover:text-aapta-ink transition-colors duration-200">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="sec-label mb-5">Stay connected</p>
          <p className="text-xs text-aapta-muted leading-7 mb-5">
            New drops land unannounced. Follow along.
          </p>
          <form onSubmit={e => e.preventDefault()} className="flex gap-2">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-white border border-aapta-gold/30 rounded-sm px-3 py-2 text-xs text-aapta-ink placeholder:text-aapta-muted/50 outline-none focus:border-aapta-gold transition-colors"
              style={{ colorScheme: 'light' }}
            />
            <button type="submit" className="btn-dark text-[10px] px-4 py-2">Join</button>
          </form>
        </div>
      </div>

      <div className="border-t border-aapta-gold/10 py-4">
        <p className="text-center text-[10px] text-aapta-muted tracking-widest uppercase">
          © {new Date().getFullYear()} Aapta · All rights reserved
        </p>
      </div>
    </footer>
  )
}
