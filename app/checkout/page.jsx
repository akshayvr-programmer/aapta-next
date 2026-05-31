'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    phone:    '',
    address:  '',
    city:     '',
    state:    '',
    pincode:  '',
  })

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)' }}>
      <div className="text-center">
        <p className="font-serif text-2xl text-aapta-ink mb-4">Your bag is empty.</p>
        <Link href="/shop" className="btn-dark">Browse the edit</Link>
      </div>
    </div>
  )

  async function handlePayment() {
    // Validate form
    const required = ['name','email','phone','address','city','state','pincode']
    for (const field of required) {
      if (!form[field].trim()) {
        alert(`Please fill in your ${field}`)
        return
      }
    }

    setLoading(true)

    try {
      // Create Razorpay order from our backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      })
      const { orderId, error } = await res.json()
      if (error) throw new Error(error)

      // Load Razorpay checkout
      const options = {
        key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:   totalPrice * 100,
        currency: 'INR',
        name:     'Aapta',
        description: 'Heirloom textiles reimagined',
        order_id: orderId,
        prefill: {
          name:    form.name,
          email:   form.email,
          contact: form.phone,
        },
        theme: { color: '#C9A96E' },
        handler: async function(response) {
          // Payment successful
          clearCart()
          router.push('/order-confirmed')
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch(e) {
      alert('Payment failed: ' + e.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)', minHeight: '100vh' }}>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">

        {/* LEFT — Shipping details */}
        <div>
          <p className="sec-label mb-3">Shipping details</p>
          <h1 className="font-serif font-light text-aapta-ink mb-8"
            style={{ fontSize: '2rem' }}>
            Where should we send it?
          </h1>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Full name</p>
              <input
                type="text" placeholder="Priya Sharma"
                value={form.name} onChange={e => update('name', e.target.value)}
                className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"
                style={{ colorScheme: 'light' }}
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Email</p>
                <input
                  type="email" placeholder="priya@email.com"
                  value={form.email} onChange={e => update('email', e.target.value)}
                  className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"
                  style={{ colorScheme: 'light' }}
                />
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Phone</p>
                <input
                  type="tel" placeholder="+91 98765 43210"
                  value={form.phone} onChange={e => update('phone', e.target.value)}
                  className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Address</p>
              <textarea
                placeholder="Flat / House no., Street, Area"
                value={form.address} onChange={e => update('address', e.target.value)}
                className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40 resize-none"
                style={{ colorScheme: 'light', minHeight: '80px' }}
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">City</p>
                <input
                  type="text" placeholder="Mumbai"
                  value={form.city} onChange={e => update('city', e.target.value)}
                  className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"
                  style={{ colorScheme: 'light' }}
                />
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">State</p>
                <input
                  type="text" placeholder="Maharashtra"
                  value={form.state} onChange={e => update('state', e.target.value)}
                  className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Pincode</p>
              <input
                type="text" placeholder="400001"
                value={form.pincode} onChange={e => update('pincode', e.target.value)}
                className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"
                style={{ colorScheme: 'light' }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — Order summary */}
        <div>
          <p className="sec-label mb-3">Order summary</p>
          <h2 className="font-serif font-light text-aapta-ink mb-8"
            style={{ fontSize: '2rem' }}>
            {items.length} {items.length === 1 ? 'piece' : 'pieces'}
          </h2>

          {/* Items */}
          <div className="flex flex-col gap-3 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center rounded-sm p-4"
                style={{
                  background: 'linear-gradient(135deg, #1A1410 0%, #2D2018 100%)',
                  border: '0.5px solid rgba(201,169,110,0.2)',
                }}>
                <div className="w-14 h-14 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.bg_color }} />
                <div className="flex-1">
                  <p className="font-serif text-aapta-cream text-sm">{item.title}</p>
                  <p className="text-aapta-gold text-xs mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="rounded-sm p-5 mb-6"
            style={{
              background: 'linear-gradient(135deg, #1A1410 0%, #2D2018 100%)',
              border: '0.5px solid rgba(201,169,110,0.25)',
            }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-aapta-muted text-sm">Subtotal</span>
              <span className="font-serif text-aapta-cream">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-aapta-muted text-sm">Shipping</span>
              <span className="text-aapta-gold text-sm">Free</span>
            </div>
            <div style={{ height: '0.5px', background: 'rgba(201,169,110,0.2)', margin: '12px 0' }} />
            <div className="flex justify-between items-center">
              <span className="font-sans font-medium text-sm tracking-widest uppercase text-aapta-gold">Total</span>
              <span className="font-serif text-aapta-gold text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full font-sans font-semibold text-sm tracking-widest uppercase px-6 py-4 rounded-sm transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
              color: '#1A1410',
              boxShadow: '0 0 30px rgba(201,169,110,0.35)',
              letterSpacing: '0.15em',
            }}
          >
            {loading ? 'Processing...' : '✦ Pay now'}
          </button>

          <p className="text-center text-xs text-aapta-muted/50 mt-4">
            Secured by Razorpay · Free returns
          </p>
        </div>
      </div>
    </div>
  )
}
