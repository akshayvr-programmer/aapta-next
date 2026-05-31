export default function StyleOutPage() {
  return (
    <div className="bg-aapta-warm min-h-screen py-16 px-6">
      <div className="max-w-xl mx-auto text-center mb-10">
        <p className="sec-label mb-3">Powered by AI</p>
        <h1 className="font-serif font-light text-aapta-ink mb-3"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
          StyleOut AI
        </h1>
        <p className="text-aapta-muted text-sm leading-relaxed">
          Your intelligent wardrobe companion. Launching soon.
        </p>
      </div>
      <div className="max-w-xl mx-auto bg-aapta-cream rounded-sm border border-aapta-gold/20 p-8 text-center">
        <p className="font-serif italic text-aapta-gold text-lg mb-3">Coming soon</p>
        <p className="text-aapta-muted text-sm leading-relaxed">
          The full 5-step StyleOut AI flow launches with the backend.
        </p>
      </div>
    </div>
  )
}
