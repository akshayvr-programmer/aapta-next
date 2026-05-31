'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['All', 'Jackets', 'Dresses', 'Sets', 'Tops', 'Bottoms']

export default function Shop() {
  const [products, setProducts] = useState([])
  const [active, setActive]     = useState('All')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) console.error(error)
      else setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = active === 'All'
    ? products
    : products.filter(p => p.category === active)

  return (
    <div className="bg-aapta-cream min-h-screen">

      <div className="bg-aapta-ink px-6 py-16 text-center">
        <p className="sec-label mb-3">The current edit</p>
        <h1
          className="font-serif font-light text-aapta-cream mb-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Monsoon '25
        </h1>
        <p className="text-aapta-muted text-sm">
          Each piece is one of a kind. Once it's gone, it's gone.
        </p>
      </div>

      <div className="border-b border-aapta-gold/20 px-6 py-4 flex gap-3 overflow-x-auto bg-aapta-warm">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-[10px] tracking-widest uppercase font-sans whitespace-nowrap px-4 py-2 rounded-sm transition-all duration-200 ${
              active === cat
                ? 'bg-aapta-ink text-aapta-gold'
                : 'text-aapta-muted hover:text-aapta-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {loading ? (
          <div className="text-center py-20">
            <p className="font-serif italic text-aapta-gold text-lg">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function ProductCard({ item }) {
  const sold = item.status === 'sold'

  return (
    <Link href={`/shop/${item.slug}`} className="group block">
      <div
        className="w-full h-64 rounded-sm mb-3 relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: item.bg_color }}
      >
        <div className="absolute inset-0 bg-aapta-ink/0 group-hover:bg-aapta-ink/10 transition-colors duration-300" />
        {sold && (
          <span className="absolute top-2 right-2 bg-aapta-ink text-aapta-gold text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm">
            Sold out
          </span>
        )}
      </div>
      <p className={`text-[10px] tracking-widest uppercase mb-1 ${sold ? 'text-aapta-muted/40' : 'text-aapta-gold'}`}>
        {item.badge}
      </p>
      <p className={`font-serif text-sm mb-1 transition-colors duration-200 ${
        sold ? 'text-aapta-muted/40' : 'text-aapta-ink group-hover:text-aapta-gold'
      }`}>
        {item.title}
      </p>
      <p className={`text-xs ${sold ? 'text-aapta-muted/30' : 'text-aapta-muted'}`}>
        ₹{item.price.toLocaleString('en-IN')}
      </p>
    </Link>
  )
}
