'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCart } from './CartContext'

const LEFT  = [
  { label: 'New Drop',  href: '/new-drop' },
  { label: 'Story',     href: '/story' },
  { label: 'Transform', href: '/transform' },
]

const RIGHT = [
  { label: 'StyleOut AI', href: '/styleout' },
  { label: 'Shop',        href: '/shop' },
]

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { totalItems } = useCart()
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'linear-gradient(135deg, #0F0C09 0%, #1A1410 60%, #2D2018 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        <nav className="hidden md:flex items-center gap-10 flex-1">
          {LEFT.map(({ label, href }) => (
            <Link key={label} href={href}
              className={`font-serif transition-colors duration-200 ${
                pathname === href ? 'text-aapta-gold' : 'text-aapta-gold hover:text-aapta-gold-light'
              }`}
              style={{ fontSize: '0.85rem', letterSpacing: '0.18em', fontWeight: 500 }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex flex-col items-center mx-auto md:mx-0 group">
          <span
            className="font-serif uppercase text-aapta-gold group-hover:text-aapta-gold-light transition-colors duration-300"
            style={{
              fontSize: '2.4rem', letterSpacing: '0.7em', fontWeight: 600,
              paddingRight: '0.7em',
              textShadow: '0 0 60px rgba(201,169,110,0.5), 0 0 20px rgba(201,169,110,0.3)',
            }}
          >
            AAPTA
          </span>
          <span className="font-serif italic text-aapta-gold/80"
            style={{ fontSize: '0.75rem', letterSpacing: '0.45em' }}>
            आप्त
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 flex-1 justify-end">
          {RIGHT.map(({ label, href }) => (
            <Link key={label} href={href}
              className={`font-serif transition-colors duration-200 ${
                pathname === href ? 'text-aapta-gold' : 'text-aapta-gold hover:text-aapta-gold-light'
              }`}
              style={{ fontSize: '0.85rem', letterSpacing: '0.18em', fontWeight: 500 }}
            >
              {label}
            </Link>
          ))}
          <Link href="/cart" className="relative text-aapta-gold hover:text-aapta-gold-light transition-colors duration-200">
            <BagIcon />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-aapta-gold text-aapta-ink text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        <button
          className="md:hidden text-aapta-gold hover:text-aapta-gold-light transition-colors ml-auto text-xl"
          onClick={() => setOpen(v => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)' }} />

      {open && (
        <div className="md:hidden px-6 py-6 flex flex-col gap-6"
          style={{ background: '#0F0C09', borderTop: '1px solid rgba(201,169,110,0.2)' }}>
          {[...LEFT, ...RIGHT].map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}
              className="font-serif text-aapta-gold hover:text-aapta-gold-light transition-colors"
              style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>
              {label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setOpen(false)}
            className="font-serif text-aapta-gold"
            style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>
            Bag {totalItems > 0 ? `(${totalItems})` : ''}
          </Link>
        </div>
      )}
    </header>
  )
}
