'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartContext'

export default function Cart() {
  const cart = useCart()

  if (!cart) return null

  const { items, removeFromCart, totalItems, totalPrice } = cart

  if (totalItems === 0) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)' }}>
      <div className="text-center">
        <p className="font-serif text-3xl font-light text-aapta-ink mb-3">Your bag is empty.</p>
        <p className="text-aapta-muted text-sm mb-8">Every piece here is one of a kind — don't wait too long.</p>
        <Link href="/shop" className="btn-dark">Browse the edit</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)' }}>
      <div className="max-w-3xl mx-auto px-6 py-14">

        <div className="mb-10">
          <p className="sec-label mb-2">Your bag</p>
          <h1 className="font-serif font-light text-aapta-ink"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
            {totalItems} {totalItems === 1 ? 'piece' : 'pieces'} selected
          </h1>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          {items.map(item => (
            <div key={item.id} className="flex gap-5 items-center rounded-sm p-5"
              style={{
                background: 'linear-gradient(135deg, #1A1410 0%, #2D2018 100%)',
                border: '0.5px solid rgba(201,169,110,0.2)',
              }}>
              <div className="w-20 h-20 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.bg_color }} />
              <div className="flex-1">
                <p className="sec-label mb-1">{item.badge}</p>
                <p className="font-serif text-aapta-cream text-lg mb-1">{item.title}</p>
                <p className="text-aapta-gold text-sm">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)}
                className="text-aapta-muted hover:text-aapta-gold transition-colors text-xs tracking-widest uppercase">
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-sm p-6 mb-6"
          style={{
            background: 'linear-gradient(135deg, #1A1410 0%, #2D2018 100%)',
            border: '0.5px solid rgba(201,169,110,0.25)',
          }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-aapta-muted text-sm">Subtotal</span>
            <span className="font-serif text-aapta-cream text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-aapta-muted text-sm">Shipping</span>
            <span className="text-aapta-gold text-sm">Free</span>
          </div>
          <div style={{ height: '0.5px', background: 'rgba(201,169,110,0.2)', margin: '16px 0' }} />
          <div className="flex justify-between items-center">
            <span className="font-sans font-medium text-sm tracking-widest uppercase text-aapta-gold">Total</span>
            <span className="font-serif text-aapta-gold text-2xl">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <Link href="/checkout"
          className="w-full text-center font-sans font-semibold text-sm tracking-widest uppercase px-6 py-4 rounded-sm transition-all duration-200 hover:scale-[1.01] mb-3 block"
          style={{
            background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
            color: '#1A1410',
            boxShadow: '0 0 30px rgba(201,169,110,0.35)',
            letterSpacing: '0.15em',
          }}>
          ✦ Proceed to checkout
        </Link>

        <Link href="/shop"
          className="w-full text-center block font-sans text-xs tracking-widest uppercase py-4 rounded-sm border transition-all duration-200 hover:border-aapta-gold hover:text-aapta-gold"
          style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#6B6259' }}>
          Continue browsing
        </Link>
      </div>
    </div>
  )
}
