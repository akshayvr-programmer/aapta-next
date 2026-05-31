'use client'

import { useState } from 'react'

export default function TransformSaree() {
  const [step, setStep]       = useState(1)
  const [preview, setPreview] = useState(null)
  const [notes, setNotes]     = useState('')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')

  const handleUpload = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className="bg-aapta-ink min-h-screen">
      <div className="px-6 py-16 text-center border-b border-aapta-gold/15">
        <p className="sec-label mb-3">The heirloom engine</p>
        <h1 className="font-serif font-light text-aapta-cream mb-2"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
          Your saree. <span className="italic text-aapta-gold">Our hands.</span>
        </h1>
        <p className="text-aapta-muted text-sm leading-relaxed max-w-sm mx-auto">
          Upload a photo — we'll show you what it could become before you send us anything.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-3 mb-12">
          {[
            { num: 'Step 1', title: 'Upload a photo',     body: 'Show us your textile.' },
            { num: 'Step 2', title: 'Choose a concept',   body: "Pick a design direction." },
            { num: 'Step 3', title: 'Ship it to us',      body: "We handle everything." },
            { num: 'Step 4', title: 'Wear the new story', body: "Arrives with a provenance card.", highlight: true },
          ].map(s => (
            <div key={s.num}
              className={`border rounded-sm p-5 ${s.highlight ? 'border-aapta-gold/30 bg-aapta-gold/5' : 'border-aapta-gold/15'}`}>
              <p className="sec-label mb-2">{s.num}</p>
              <p className={`font-serif text-sm mb-2 ${s.highlight ? 'text-aapta-gold' : 'text-aapta-cream'}`}>{s.title}</p>
              <p className="text-aapta-subtle text-xs leading-[1.7]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="gold-divider mb-12" />

        {step === 1 && (
          <div>
            <p className="sec-label mb-6">Tell us about your saree</p>
            <label className="block bg-white border border-aapta-gold/30 rounded-sm p-10 text-center cursor-pointer hover:border-aapta-gold transition-colors relative overflow-hidden mb-6">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
              {preview ? (
                <img src={preview} alt="preview" className="max-h-56 mx-auto rounded-sm object-contain" />
              ) : (
                <div>
                  <p className="text-aapta-gold text-3xl mb-3">↑</p>
                  <p className="text-aapta-ink text-sm font-medium mb-1">Upload a photo of your saree</p>
                  <p className="text-aapta-muted text-xs">JPG or PNG</p>
                </div>
              )}
            </label>
            <p className="text-[10px] tracking-widest uppercase text-aapta-gold mb-2">Describe it</p>
            <textarea
              className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm leading-relaxed outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/50 resize-y min-h-[100px] mb-6 font-serif"
              style={{ colorScheme: 'light' }}
              placeholder="e.g. A 1970s Kanjivaram in deep burgundy with gold zari border..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button onClick={() => setStep(2)} className="btn-gold w-full">See design concepts →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="sec-label mb-6">Your details</p>
            <div className="flex flex-col gap-4 mb-6">
              {[
                { label: 'Full name', val: name,  set: setName,  type: 'text',  ph: 'Priya Sharma' },
                { label: 'Email',     val: email, set: setEmail, type: 'email', ph: 'priya@email.com' },
                { label: 'Phone',     val: phone, set: setPhone, type: 'tel',   ph: '+91 98765 43210' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] tracking-widest uppercase text-aapta-gold mb-2">{f.label}</p>
                  <input type={f.type} placeholder={f.ph} value={f.val}
                    onChange={e => f.set(e.target.value)}
                    className="w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/50"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => setStep(3)} className="btn-gold flex-1">Submit request</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-10">
            <p className="text-aapta-gold text-4xl mb-4">✦</p>
            <h2 className="font-serif font-light text-aapta-cream mb-3" style={{ fontSize: '1.8rem' }}>
              We'll be in touch.
            </h2>
            <p className="text-aapta-muted text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Your request has been received. We'll send a quote within 48 hours.
            </p>
            <button
              onClick={() => { setStep(1); setPreview(null); setNotes(''); setName(''); setEmail(''); setPhone('') }}
              className="btn-outline">
              Submit another saree
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
