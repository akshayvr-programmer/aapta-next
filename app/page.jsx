import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TransformTeaser />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="bg-aapta-ink text-center px-6 pt-24 pb-16">
      <p className="sec-label mb-8">Est. 2025 · Handcrafted in India</p>

      <h1
        className="font-serif font-light text-aapta-cream leading-[1.1]"
        style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
      >
        Your mother's saree
      </h1>

      <h1
        className="font-serif font-light italic text-aapta-gold leading-[1.1] mb-6"
        style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
      >
        deserves a second life.
      </h1>

      <div className="w-10 h-px bg-aapta-gold/40 mx-auto my-6" />

      <p className="text-aapta-muted text-sm leading-[1.8] max-w-sm mx-auto mb-8 font-light">
        We take sarees and heirloom textiles that have lived a lifetime — and give them a second, more beautiful life.
      </p>

      <div className="flex gap-3 justify-center mb-16">
        <Link href="/shop" className="btn-dark">Shop the Drop</Link>
        <Link href="/story" className="btn-outline">Our Story</Link>
      </div>

      <div className="grid grid-cols-3 gap-0.5 max-w-4xl mx-auto">
        {[
          { badge: 'New Drop',         title: 'The Monsoon Edit',    bg: '#2D2018' },
          { badge: 'Bestseller',       title: 'Silk Revival Jacket', bg: '#251C14' },
          { badge: 'Limited · 3 left', title: 'Banarasi Wrap Dress', bg: '#1E1710' },
        ].map((item) => (
          <Link
            key={item.title}
            href="/shop"
            className="block h-48 md:h-64 relative group overflow-hidden rounded-sm"
            style={{ backgroundColor: item.bg }}
          >
            <div className="absolute inset-0 bg-aapta-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-[9px] tracking-[0.2em] text-aapta-gold uppercase mb-1">{item.badge}</p>
              <p className="font-serif italic text-aapta-cream text-sm">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function TransformTeaser() {
  return (
    <section className="bg-aapta-ink py-20 px-6 border-t border-aapta-gold/15">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="sec-label mb-3">The heirloom engine</p>
          <h2
            className="font-serif font-light text-aapta-cream leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
          >
            Your saree.<br />
            <span className="italic text-aapta-gold">Our hands.</span>
          </h2>
          <p className="text-aapta-muted text-sm leading-[1.9] mb-8">
            Have a saree you can't wear but can't give away? Upload a photo — we'll show you three ways it could live again. No commitment until you love the concept.
          </p>
          <Link
            href="/transform"
            className="inline-block font-sans font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-sm transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
              color: '#1A1410',
              boxShadow: '0 0 30px rgba(201,169,110,0.4), 0 4px 15px rgba(201,169,110,0.2)',
              letterSpacing: '0.15em',
            }}
          >
            ✦ Transform my saree
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { num: '01', title: 'Upload',  body: 'A photo of your textile.' },
            { num: '02', title: 'Concept', body: 'We show you 3 design directions.' },
            { num: '03', title: 'Quote',   body: 'Price agreed before you ship.' },
            { num: '04', title: 'Yours',   body: 'Delivered with a provenance card.', gold: true },
          ].map(s => (
            <div
              key={s.num}
              className={`rounded-sm p-4 border ${
                s.gold ? 'border-aapta-gold/30 bg-aapta-gold/5' : 'border-aapta-gold/15'
              }`}
            >
              <p className={`font-serif text-2xl font-light leading-none mb-2 ${
                s.gold ? 'text-aapta-gold/50' : 'text-aapta-gold/20'
              }`}>{s.num}</p>
              <p className={`font-serif text-sm mb-1 ${s.gold ? 'text-aapta-gold' : 'text-aapta-cream'}`}>
                {s.title}
              </p>
              <p className="text-aapta-subtle text-xs leading-[1.6]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
