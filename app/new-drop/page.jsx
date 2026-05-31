import Link from 'next/link'

const DROP = [
  { slug: 'silk-kantha-jacket',  title: 'Silk Kantha Jacket',  price: '₹8,400',  badge: '1 of 1',      bg: '#E8E3D8', desc: 'Kantha silk, West Bengal, c. 1985' },
  { slug: 'banarasi-wrap-dress', title: 'Banarasi Wrap Dress', price: '₹12,000', badge: '2 of 3 left',  bg: '#E0D9CE', desc: 'Banarasi brocade, Varanasi, c. 1972' },
  { slug: 'patola-midi-skirt',   title: 'Patola Midi Skirt',   price: '₹7,800',  badge: '3 left',       bg: '#DDD6CA', desc: 'Double-ikat Patola, Gujarat, c. 1965' },
]

export default function NewDrop() {
  return (
    <div className="bg-aapta-ink min-h-screen">

      {/* Header */}
      <div className="px-6 py-20 text-center border-b border-aapta-gold/15">
        <p className="sec-label mb-4">Just dropped</p>
        <h1
          className="font-serif font-light text-aapta-cream mb-4"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
        >
          The Monsoon Edit
        </h1>
        <p className="font-serif italic text-aapta-gold text-lg mb-6">
          Monsoon '25
        </p>
        <p className="text-aapta-muted text-sm leading-relaxed max-w-sm mx-auto">
          Three pieces. Each one of a kind. Sourced from heirloom textiles across India — reimagined for now.
        </p>
      </div>

      {/* Featured piece */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="sec-label mb-8 text-center">The edit</p>

        <div className="flex flex-col gap-6">
          {DROP.map((item, i) => (
            <Link
              key={item.slug}
              href={`/shop/${item.slug}`}
              className="group grid md:grid-cols-2 gap-0 rounded-sm overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}
            >
              {/* Image */}
              <div
                className="h-64 md:h-80 relative flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <div className="absolute inset-0 bg-aapta-ink/0 group-hover:bg-aapta-ink/10 transition-colors duration-300" />
                <p className="text-aapta-muted/30 text-xs tracking-widest uppercase">Photo coming soon</p>
              </div>

              {/* Info */}
              <div
                className="p-8 flex flex-col justify-center"
                style={{ background: 'linear-gradient(135deg, #1A1410 0%, #2D2018 100%)' }}
              >
                <p className="sec-label mb-3">{item.badge}</p>
                <h2
                  className="font-serif font-light text-aapta-cream mb-2 group-hover:text-aapta-gold transition-colors duration-200"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                >
                  {item.title}
                </h2>
                <p className="font-serif italic text-aapta-gold/60 text-sm mb-4">{item.desc}</p>
                <p className="font-serif text-aapta-gold text-xl mb-6">{item.price}</p>
                <span className="text-[10px] tracking-widest uppercase text-aapta-gold/60 group-hover:text-aapta-gold transition-colors duration-200">
                  View piece →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/shop" className="btn-outline">
            View full catalogue
          </Link>
        </div>
      </div>

    </div>
  )
}
