import Link from 'next/link'

export default function OrderConfirmed() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)' }}>
      <div className="text-center max-w-md px-6">
        <p className="text-aapta-gold text-5xl mb-6">✦</p>
        <h1 className="font-serif font-light text-aapta-ink mb-4"
          style={{ fontSize: '2.4rem' }}>
          Order confirmed.
        </h1>
        <p className="text-aapta-muted text-sm leading-relaxed mb-4">
          Thank you for your order. We'll send you a confirmation email shortly and begin preparing your piece.
        </p>
        <p className="font-serif italic text-aapta-gold text-sm mb-10">
          Your mother's saree deserves a second life.
        </p>
        <Link href="/shop" className="btn-dark">Continue browsing</Link>
      </div>
    </div>
  )
}
