import StyleOutAI from '@/components/StyleOutAI'

export default function StyleOutPage() {
  return (
    <div className="bg-aapta-warm min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <p className="sec-label mb-3">Powered by AI</p>
        <h1 className="font-serif font-light text-aapta-ink mb-3"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
          StyleOut AI
        </h1>
        <p className="text-aapta-muted text-sm leading-relaxed">
          Your intelligent wardrobe companion. Upload, describe, or just tell us your vibe.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <StyleOutAI />
      </div>
    </div>
  )
}
