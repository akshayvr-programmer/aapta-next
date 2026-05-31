'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/components/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart, items } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', id)
        .single()
      if (error) console.error(error)
      else setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product && items.find(i => i.id === product.id)) setAdded(true)
  }, [items, product])

  function handleAddToCart() {
    addToCart(product)
    setAdded(true)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 100%)' }}>
      <p className="font-serif italic text-aapta-gold text-xl tracking-widest">One moment...</p>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-aapta-warm">
      <div className="text-center">
        <p className="font-serif text-2xl text-aapta-ink mb-4">Piece not found</p>
        <Link href="/shop" className="btn-dark">Back to shop</Link>
      </div>
    </div>
  )

  const sold = product.status === 'sold'

  return (
    <div style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 40%, #E8E3D8 100%)', minHeight: '100vh' }}>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        <Link href="/shop"
          className="text-xs tracking-widest uppercase text-aapta-muted hover:text-aapta-gold transition-colors duration-200 inline-flex items-center gap-2">
          ← Back to the edit
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-16 items-start">

        {/* LEFT — dark panel */}
        <div>
          <div
            className="rounded-sm w-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1A1410 0%, #2D2018 60%, #1A1410 100%)',
              height: '560px',
              boxShadow: '0 24px 60px rgba(26,20,16,0.25)',
            }}
          >
            <div className="absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(201,169,110,0.08) 0%, transparent 60%)' }} />
            <div className="absolute top-4 left-4 w-8 h-8"
              style={{ borderTop: '1px solid rgba(201,169,110,0.4)', borderLeft: '1px solid rgba(201,169,110,0.4)' }} />
            <div className="absolute top-4 right-4 w-8 h-8"
              style={{ borderTop: '1px solid rgba(201,169,110,0.4)', borderRight: '1px solid rgba(201,169,110,0.4)' }} />
            <div className="absolute bottom-4 left-4 w-8 h-8"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.4)', borderLeft: '1px solid rgba(201,169,110,0.4)' }} />
            <div className="absolute bottom-4 right-4 w-8 h-8"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.4)', borderRight: '1px solid rgba(201,169,110,0.4)' }} />
            {sold && (
              <div className="absolute top-6 left-6 bg-aapta-gold text-aapta-ink text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-sm font-semibold">
                Sold out
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
              <p className="font-serif italic text-aapta-gold/50 text-xs tracking-[0.3em] uppercase">Photo coming soon</p>
              <div className="w-12 h-px bg-aapta-gold/20" />
              <p className="font-serif text-aapta-gold/30 text-xs tracking-widest text-center">{product.title}</p>
            </div>
          </div>

          <div className="mt-4 rounded-sm px-5 py-4"
            style={{ background: 'linear-gradient(135deg, #1A1410 0%, #2D2018 100%)', border: '0.5px solid rgba(201,169,110,0.25)' }}>
            <p className="text-[9px] tracking-[0.2em] uppercase text-aapta-gold mb-2">✦ Provenance</p>
            <p className="text-sm text-aapta-gold/70 leading-relaxed font-serif italic">{product.origin}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="pt-2">
          <p className={`text-xs tracking-widest uppercase mb-3 font-medium ${sold ? 'text-aapta-muted/40' : 'text-aapta-gold'}`}>
            {product.badge}
          </p>
          <h1 className="font-serif font-light text-aapta-ink leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}>
            {product.title}
          </h1>
          <p className="font-serif text-aapta-gold mb-6" style={{ fontSize: '1.5rem', fontWeight: 400 }}>
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          <div style={{ height: '0.5px', background: 'linear-gradient(90deg, rgba(201,169,110,0.6), rgba(201,169,110,0.1))', marginBottom: '24px' }} />
          <p className="text-aapta-ink mb-8" style={{ fontSize: '1rem', fontWeight: 300, lineHeight: '2' }}>
            {product.description}
          </p>
          <div className="flex flex-col gap-4 mb-8">
            {[
              { label: 'Category',  value: product.category },
              { label: 'Edition',   value: product.badge },
              { label: 'Condition', value: 'Carefully restored' },
              { label: 'Care',      value: 'Dry clean only' },
            ].map(d => (
              <div key={d.label} className="flex items-baseline gap-4">
                <span className="text-[11px] tracking-widest uppercase text-aapta-muted/60 min-w-[90px] font-medium">{d.label}</span>
                <span className="text-sm text-aapta-muted">{d.value}</span>
              </div>
            ))}
          </div>
          <div style={{ height: '0.5px', background: 'linear-gradient(90deg, rgba(201,169,110,0.6), rgba(201,169,110,0.1))', marginBottom: '28px' }} />

          {sold ? (
            <button disabled className="w-full mb-3 font-sans font-medium text-sm tracking-widest uppercase px-6 py-4 rounded-sm opacity-40 cursor-not-allowed bg-aapta-ink text-aapta-gold">
              Sold out
            </button>
          ) : added ? (
            <button onClick={() => router.push('/cart')}
              className="w-full mb-3 font-sans font-semibold text-sm tracking-widest uppercase px-6 py-4 rounded-sm transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
                color: '#1A1410',
                boxShadow: '0 0 30px rgba(201,169,110,0.35)',
                letterSpacing: '0.15em',
              }}>
              ✦ View bag
            </button>
          ) : (
            <button onClick={handleAddToCart}
              className="w-full mb-3 font-sans font-semibold text-sm tracking-widest uppercase px-6 py-4 rounded-sm transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
                color: '#1A1410',
                boxShadow: '0 0 30px rgba(201,169,110,0.35)',
                letterSpacing: '0.15em',
              }}>
              ✦ Add to bag
            </button>
          )}

          <Link href="/styleout"
            className="w-full text-center block font-sans text-xs tracking-widest uppercase py-4 rounded-sm border transition-all duration-200 hover:border-aapta-gold hover:text-aapta-gold mb-5"
            style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#6B6259' }}>
            Style this piece with AI
          </Link>
          <p className="text-center text-xs text-aapta-muted/50 leading-relaxed">
            Free returns if you're not in love with it.
          </p>
        </div>
      </div>
    </div>
  )
}
