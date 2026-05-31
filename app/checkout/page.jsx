'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const COUNTRY_CODES = [
  { code: '+91',  country: 'IN', flag: '🇮🇳' },
  { code: '+1',   country: 'US', flag: '🇺🇸' },
  { code: '+44',  country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65',  country: 'SG', flag: '🇸🇬' },
  { code: '+61',  country: 'AU', flag: '🇦🇺' },
  { code: '+49',  country: 'DE', flag: '🇩🇪' },
  { code: '+33',  country: 'FR', flag: '🇫🇷' },
  { code: '+81',  country: 'JP', flag: '🇯🇵' },
  { code: '+86',  country: 'CN', flag: '🇨🇳' },
]

const inputClass = "w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"

export default function Checkout() {
  const cart = useCart()
  const router = useRouter()
  const [loading, setLoading]               = useState(false)
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [otpSent, setOtpSent]               = useState(false)
  const [otpVerified, setOtpVerified]       = useState(false)
  const [otpInput, setOtpInput]             = useState('')
  const [otpError, setOtpError]             = useState('')
  const [countryCode, setCountryCode]       = useState('+91')
  const [pincodeMsg, setPincodeMsg]         = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '',
    district: '', pincode: '', country: 'India',
  })

  if (!cart) return null
  const { items, totalPrice, clearCart } = cart
  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  // ── Pincode autofill ──────────────────────────────────────────────
  async function handlePincode(val) {
    update('pincode', val)
    setPincodeMsg('')
    if (val.length !== 6) return

    setPincodeLoading(true)
    try {
      const res  = await fetch(`/api/pincode?pin=${val}`)
      const data = await res.json()

      if (data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0]
        // PostOffice fields: Name, BranchType, DeliveryStatus, Circle,
        // District, Division, Region, Block, State, Country, Pincode
        setForm(f => ({
          ...f,
          pincode:  val,
          city:     po.Block !== 'NA' ? po.Block : po.District,
          district: po.District,
          state:    po.State,
          country:  po.Country || 'India',
        }))
        setPincodeMsg(`✓ ${po.District}, ${po.State}`)
      } else {
        setPincodeMsg('Pincode not found — please fill manually')
      }
    } catch(e) {
      setPincodeMsg('Lookup failed — please fill manually')
    }
    setPincodeLoading(false)
  }

  // ── Location detect ───────────────────────────────────────────────
  async function detectLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser')
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          )
          const data = await res.json()
          const addr = data.address
          const pincode = addr.postcode || ''

          setForm(f => ({
            ...f,
            city:    addr.city || addr.town || addr.village || addr.suburb || '',
            state:   addr.state || '',
            country: addr.country || 'India',
            pincode,
            address: [addr.road, addr.neighbourhood, addr.suburb]
              .filter(Boolean).join(', '),
          }))

          if (pincode.length === 6) handlePincode(pincode)
        } catch(e) {
          alert('Could not fetch location. Please fill manually.')
        }
        setLocationLoading(false)
      },
      () => {
        alert('Location access denied. Please fill manually.')
        setLocationLoading(false)
      }
    )
  }

  // ── OTP ───────────────────────────────────────────────────────────
  async function sendOtp() {
    if (!form.phone || form.phone.length < 10) {
      alert('Please enter a valid phone number')
      return
    }
    setOtpSent(true)
    setOtpError('')
    alert('OTP sent! (Demo mode: use 1234)')
  }

  function verifyOtp() {
    if (otpInput === '1234') {
      setOtpVerified(true)
      setOtpError('')
    } else {
      setOtpError('Incorrect OTP. Please try again.')
    }
  }

  // ── Payment ───────────────────────────────────────────────────────
  async function handlePayment() {
    const required = ['name','email','phone','address','city','state','pincode']
    for (const field of required) {
      if (!form[field].trim()) {
        alert(`Please fill in your ${field}`)
        return
      }
    }
    if (!otpVerified) {
      alert('Please verify your phone number with OTP first')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: totalPrice }),
      })
      const { orderId, error } = await res.json()
      if (error) throw new Error(error)

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
          contact: countryCode + form.phone,
        },
        theme: { color: '#C9A96E' },
        handler: async function() {
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

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)' }}>
      <div className="text-center">
        <p className="font-serif text-2xl text-aapta-ink mb-4">Your bag is empty.</p>
        <Link href="/shop" className="btn-dark">Browse the edit</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)', minHeight: '100vh' }}>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">

        {/* LEFT */}
        <div>
          <p className="sec-label mb-3">Shipping details</p>
          <h1 className="font-serif font-light text-aapta-ink mb-8" style={{ fontSize: '2rem' }}>
            Where should we send it?
          </h1>

          <div className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Full name</p>
              <input type="text" placeholder="Priya Sharma"
                value={form.name} onChange={e => update('name', e.target.value)}
                className={inputClass} style={{ colorScheme: 'light' }} />
            </div>

            {/* Email */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Email</p>
              <input type="email" placeholder="priya@email.com"
                value={form.email} onChange={e => update('email', e.target.value)}
                className={inputClass} style={{ colorScheme: 'light' }} />
            </div>

            {/* Phone + OTP */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">
                Phone {otpVerified && <span className="text-green-600 ml-2 normal-case tracking-normal">✓ Verified</span>}
              </p>
              <div className="flex gap-2 mb-2">
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                  className="bg-white border border-aapta-gold/30 rounded-sm px-2 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold"
                  style={{ colorScheme: 'light', minWidth: '95px' }}>
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input type="tel" placeholder="98765 43210"
                  value={form.phone} onChange={e => update('phone', e.target.value)}
                  className={`${inputClass} flex-1`} style={{ colorScheme: 'light' }}
                  disabled={otpVerified} />
                {!otpVerified && (
                  <button onClick={sendOtp}
                    className="px-3 py-3 rounded-sm text-xs tracking-widest uppercase font-sans font-medium whitespace-nowrap"
                    style={{
                      background: otpSent ? 'transparent' : '#1A1410',
                      color: otpSent ? '#6B6259' : '#C9A96E',
                      border: otpSent ? '1px solid rgba(201,169,110,0.3)' : 'none',
                    }}>
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
              </div>
              {otpSent && !otpVerified && (
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter OTP" maxLength={6}
                    value={otpInput} onChange={e => setOtpInput(e.target.value)}
                    className={`${inputClass} flex-1`} style={{ colorScheme: 'light' }} />
                  <button onClick={verifyOtp}
                    className="px-4 py-3 rounded-sm text-xs tracking-widest uppercase font-sans font-medium"
                    style={{ background: '#C9A96E', color: '#1A1410' }}>
                    Verify
                  </button>
                </div>
              )}
              {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted">Address</p>
                <button onClick={detectLocation} disabled={locationLoading}
                  className="text-[10px] tracking-widest uppercase text-aapta-gold hover:text-aapta-gold-light transition-colors">
                  {locationLoading ? 'Detecting...' : '📍 Use my location'}
                </button>
              </div>
              <textarea placeholder="Flat / House no., Street, Area"
                value={form.address} onChange={e => update('address', e.target.value)}
                className={`${inputClass} resize-none`}
                style={{ colorScheme: 'light', minHeight: '80px' }} />
            </div>

            {/* Pincode */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">
                Pincode
                {pincodeLoading && <span className="text-aapta-gold ml-2 normal-case tracking-normal">Looking up...</span>}
                {pincodeMsg && !pincodeLoading && (
                  <span className={`ml-2 normal-case tracking-normal ${pincodeMsg.startsWith('✓') ? 'text-green-600' : 'text-red-400'}`}>
                    {pincodeMsg}
                  </span>
                )}
              </p>
              <input type="text" placeholder="400001" maxLength={6}
                value={form.pincode} onChange={e => handlePincode(e.target.value)}
                className={inputClass} style={{ colorScheme: 'light' }} />
            </div>

            {/* City + District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">City / Block</p>
                <input type="text" placeholder="Auto-filled"
                  value={form.city} onChange={e => update('city', e.target.value)}
                  className={inputClass} style={{ colorScheme: 'light' }} />
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">District</p>
                <input type="text" placeholder="Auto-filled"
                  value={form.district} onChange={e => update('district', e.target.value)}
                  className={inputClass} style={{ colorScheme: 'light' }} />
              </div>
            </div>

            {/* State + Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">State</p>
                <input type="text" placeholder="Auto-filled"
                  value={form.state} onChange={e => update('state', e.target.value)}
                  className={inputClass} style={{ colorScheme: 'light' }} />
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Country</p>
                <input type="text" placeholder="India"
                  value={form.country} onChange={e => update('country', e.target.value)}
                  className={inputClass} style={{ colorScheme: 'light' }} />
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT — Order summary */}
        <div>
          <p className="sec-label mb-3">Order summary</p>
          <h2 className="font-serif font-light text-aapta-ink mb-8" style={{ fontSize: '2rem' }}>
            {items.length} {items.length === 1 ? 'piece' : 'pieces'}
          </h2>

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

          <button onClick={handlePayment} disabled={loading}
            className="w-full font-sans font-semibold text-sm tracking-widest uppercase px-6 py-4 rounded-sm transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
              color: '#1A1410',
              boxShadow: '0 0 30px rgba(201,169,110,0.35)',
              letterSpacing: '0.15em',
            }}>
            {loading ? 'Processing...' : '✦ Pay now'}
          </button>

          <p className="text-center text-xs text-aapta-muted/50 mt-4">
            Secured by Razorpay · Free returns · Shiprocket delivery
          </p>
        </div>
      </div>
    </div>
  )
}
