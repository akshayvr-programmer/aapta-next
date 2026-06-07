
'use client'

import { useState } from 'react'

async function askClaude(system, content) {
  const res = await fetch('/api/styleout', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ system, content }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.text
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = ev => resolve(ev.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function Steps({ current }) {
  const steps = ['Try-On', 'Pair It', 'Silhouette', 'My Vibe', 'Design Preview']
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <span className={`text-[10px] tracking-widest uppercase font-sans whitespace-nowrap px-3 py-2 rounded-sm ${
            i === current
              ? 'bg-aapta-gold text-aapta-ink font-semibold'
              : i < current
              ? 'text-aapta-gold/60'
              : 'text-aapta-muted'
          }`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="text-aapta-gold/20 mx-1 text-xs">›</span>
          )}
        </div>
      ))}
    </div>
  )
}

function Chip({ label, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-xs font-sans border transition-all duration-150 ${
        selected
          ? 'bg-aapta-ink text-aapta-gold border-aapta-ink'
          : 'bg-white text-aapta-muted border-aapta-gold/30 hover:border-aapta-gold'
      }`}
    >
      {label}
    </button>
  )
}

function UploadBox({ label, icon, preview, onChange }) {
  return (
    <div className="flex-1">
      <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">{label}</p>
      <label className="relative block border border-dashed border-aapta-gold/30 rounded-sm p-6 text-center cursor-pointer hover:border-aapta-gold transition-colors bg-white overflow-hidden">
        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} />
        {preview ? (
          <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-sm mx-auto" />
        ) : (
          <>
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-xs text-aapta-muted">Upload</p>
          </>
        )}
      </label>
    </div>
  )
}

function Result({ label, text }) {
  if (!text) return null
  return (
    <div className="mt-5 bg-white border border-aapta-gold/30 rounded-sm p-5">
      <p className="font-serif italic text-aapta-gold text-sm mb-3">{label}</p>
      <p className="text-aapta-ink text-sm leading-[1.85] whitespace-pre-wrap">{text}</p>
    </div>
  )
}

function AiButton({ onClick, loading, label }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full font-sans font-semibold text-xs tracking-widest uppercase py-3.5 rounded-sm mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
        color: '#1A1410',
        boxShadow: loading ? 'none' : '0 0 20px rgba(201,169,110,0.3)',
      }}
    >
      {loading ? 'Analysing...' : `✦ ${label}`}
    </button>
  )
}

const INVENTORY = [
  { slug: 'silk-kantha-jacket',  title: 'Silk Kantha Jacket',  price: '₹8,400',  bg: '#E8E3D8', desc: 'Hand-stitched Kantha silk jacket with mandarin collar.' },
  { slug: 'banarasi-wrap-dress', title: 'Banarasi Wrap Dress', price: '₹12,000', bg: '#E0D9CE', desc: 'Ivory Banarasi brocade wrap dress, zari border as hem.' },
  { slug: 'chanderi-crop-set',   title: 'Chanderi Crop Set',   price: '₹9,600',  bg: '#EDE8DF', desc: 'Two-piece Chanderi set.' },
  { slug: 'kanjivaram-blouse',   title: 'Kanjivaram Blouse',   price: '₹6,200',  bg: '#E4DDD2', desc: 'Sculptural blouse from Kanjivaram border panel.' },
  { slug: 'patola-midi-skirt',   title: 'Patola Midi Skirt',   price: '₹7,800',  bg: '#DDD6CA', desc: 'Double-ikat Patola midi A-line skirt.' },
  { slug: 'tussar-silk-trench',  title: 'Tussar Silk Trench',  price: '₹14,500', bg: '#E2DBD0', desc: 'Floor-length trench in undyed Tussar silk.' },
]

export default function StyleOutAI() {
  const [step, setStep]             = useState(0)
  const [uploads, setUploads]       = useState({})
  const [previews, setPreviews]     = useState({})
  const [results, setResults]       = useState({})
  const [loading, setLoading]       = useState(false)
  const [occasion, setOccasion]     = useState(null)
  const [mood, setMood]             = useState(null)
  const [shape, setShape]           = useState(null)
  const [cats, setCats]             = useState([])
  const [persona, setPersona]       = useState([])
  const [colors, setColors]         = useState([])
  const [designMode, setDesignMode] = useState('saree')
  const [gender, setGender]         = useState('women')
  const [dtype, setDtype]           = useState(null)
  const [dshape, setDshape]         = useState(null)
  const [docc, setDocc]             = useState(null)
  const [pairItem, setPairItem]     = useState('')
  const [pairSeason, setPairSeason] = useState('Summer')
  const [vibeText, setVibeText]     = useState('')
  const [vibeNeed, setVibeNeed]     = useState('Everyday rotation')
  const [vibeBudget, setVibeBudget] = useState('Mid-range')
  const [bodyH, setBodyH]           = useState("Petite (under 5'3\")")
  const [bodyHL, setBodyHL]         = useState('Shoulders')
  const [sareeDesc, setSareeDesc]   = useState('')
  const [selInv, setSelInv]         = useState(null)

  function toggleMulti(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }

  async function handleUpload(key, e) {
    const file = e.target.files?.[0]
    if (!file) return
    const b64 = await toBase64(file)
    setUploads(u => ({ ...u, [key]: b64 }))
    setPreviews(p => ({ ...p, [key]: URL.createObjectURL(file) }))
  }

  function mkContent(text, imgKeys) {
    const content = []
    for (const k of imgKeys) {
      if (uploads[k]) {
        content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: uploads[k] } })
        content.push({ type: 'text', text: k === 'you' ? 'This is the person.' : k === 'outfit' ? 'This is the clothing piece.' : k === 'saree' ? 'This is the heirloom textile.' : 'This is the person.' })
      }
    }
    content.push({ type: 'text', text })
    return content.length > 1 ? content : text
  }

  async function run(id, system, content) {
    setLoading(true)
    setResults(r => ({ ...r, [id]: '' }))
    try {
      const text = await askClaude(system, content)
      setResults(r => ({ ...r, [id]: text }))
    } catch(e) {
      setResults(r => ({ ...r, [id]: 'Unable to connect. Please try again.' }))
    }
    setLoading(false)
  }

  const runTryOn = () => run('tryon',
    'You are StyleOut AI for Aapta, a luxury Indian upcycled fashion brand. Give warm, precise, editorial advice. Under 200 words. Structure: overall impression, colour harmony, fit and silhouette, occasion suitability.',
    mkContent(`Occasion: ${occasion ?? 'general'}. Analyse how this piece would look on this person.`, ['you', 'outfit'])
  )

  const runPair = () => {
    if (!pairItem.trim()) { alert('Please describe your piece.'); return }
    run('pair',
      'You are StyleOut AI for Aapta. Expert stylist in Indian and contemporary fashion. Structure: 1) Bottom/top 2) Outerwear 3) Footwear 4) Accessories and jewellery 5) One unexpected tip. Under 220 words.',
      `Piece: ${pairItem}\nMood: ${mood ?? 'versatile'}\nSeason: ${pairSeason}`
    )
  }

  const runBody = () => run('body',
    'You are Aapta Body Intelligence module. Empowering, precise. Structure: 1) Silhouette strengths 2) Cuts that work 3) Fabrics and drapes 4) Gentle avoids 5) Signature look. Under 230 words.',
    `Shape: ${shape ?? 'not specified'}\nHeight: ${bodyH}\nHighlight: ${bodyHL}\nCategories: ${cats.join(', ') || 'various'}`
  )

  const runVibe = () => run('vibe',
    'You are Aapta personal style engine. Structure: 1) Style identity 2) Capsule essentials 5-6 pieces 3) Signature palette 4) Go-to brands India-relevant 5) One style rule. Under 250 words. Make them feel seen.',
    `Persona: ${persona.join(', ') || 'eclectic'}\nColours: ${colors.join(', ') || 'varied'}\nNeed: ${vibeNeed}\nBudget: ${vibeBudget}${vibeText ? '\nContext: ' + vibeText : ''}`
  )

  const runDesign = async () => {
    setLoading(true)
    setResults(r => ({ ...r, design: '' }))
    try {
      if (designMode === 'saree') {
        const content = []
        if (uploads.saree) {
          content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: uploads.saree } })
          content.push({ type: 'text', text: 'This is the heirloom textile.' })
        }
        content.push({ type: 'text', text: `Generate 3 ${gender} design concepts. Direction: ${dtype ?? 'any'}. Occasion: ${docc ?? 'everyday'}. Body shape: ${dshape ?? 'not specified'}.${sareeDesc ? ' Context: ' + sareeDesc : ''}` })
        const text = await askClaude(
          'You are Aapta Heirloom Transformation Engine. Generate exactly 3 design concepts as flowing editorial text. Each concept: name, garment type, 2-3 sentence vivid description, which body types it flatters, one styling hook. Separate with line breaks. Under 300 words.',
          content.length > 1 ? content : content[content.length - 1].text
        )
        setResults(r => ({ ...r, design: text }))
      } else {
        if (!selInv) { alert('Please select a piece.'); setLoading(false); return }
        const content = []
        if (uploads.self) {
          content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: uploads.self } })
          content.push({ type: 'text', text: 'This is the person.' })
        }
        content.push({ type: 'text', text: `Piece: ${selInv.title} — ${selInv.desc}. Body shape: ${dshape ?? 'not specified'}. Occasion: ${docc ?? 'everyday'}. Provide: 1) Try-On Analysis 2) Body Fit 3) Complete the Look. Under 280 words.` })
        const text = await askClaude(
          'You are StyleOut AI for Aapta. Honest, warm, editorial styling advice. Structure with clear sections.',
          uploads.self ? content : content[content.length - 1].text
        )
        setResults(r => ({ ...r, design: text }))
      }
    } catch(e) {
      setResults(r => ({ ...r, design: 'Unable to connect. Please try again.' }))
    }
    setLoading(false)
  }

  const ic = "w-full bg-white border border-aapta-gold/30 rounded-sm px-4 py-3 text-aapta-ink text-sm outline-none focus:border-aapta-gold transition-colors placeholder:text-aapta-muted/40"

  return (
    <div className="bg-aapta-cream border border-aapta-gold/20 rounded-sm overflow-hidden">

      <div className="bg-aapta-ink px-6 pt-5 pb-0">
        <p className="font-serif text-xl font-light tracking-[0.4em] text-aapta-gold uppercase mb-1">StyleOut AI</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-aapta-muted mb-4">Your intelligent wardrobe companion</p>
        <div className="h-px bg-aapta-gold/10">
          <div className="h-full bg-aapta-gold transition-all duration-500"
            style={{ width: `${((step + 1) / 5) * 100}%` }} />
        </div>
      </div>

      <div className="bg-aapta-ink px-6 py-3 border-b border-aapta-gold/15">
        <Steps current={step} />
      </div>

      <div className="p-6">

        {step === 0 && (
          <div>
            <h2 className="font-serif font-light text-aapta-ink text-xl mb-1">Virtual Try-On</h2>
            <p className="text-aapta-muted text-xs italic mb-5">"How would this look on me?"</p>
            <div className="flex gap-3 mb-4">
              <UploadBox label="Your photo" icon="👤" preview={previews.you}    onChange={e => handleUpload('you', e)} />
              <UploadBox label="The piece"  icon="👗" preview={previews.outfit} onChange={e => handleUpload('outfit', e)} />
            </div>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Occasion</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Everyday','Office','Evening','Festive','Casual'].map(o => (
                <Chip key={o} label={o} selected={occasion === o} onToggle={() => setOccasion(p => p === o ? null : o)} />
              ))}
            </div>
            <AiButton onClick={runTryOn} loading={loading} label="Analyse This Look" />
            <Result label="StyleOut says —" text={results.tryon} />
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-serif font-light text-aapta-ink text-xl mb-1">Styling Assistant</h2>
            <p className="text-aapta-muted text-xs italic mb-5">"What should I pair this with?"</p>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Describe the piece</p>
            <textarea
              value={pairItem} onChange={e => setPairItem(e.target.value)}
              className={`${ic} resize-y min-h-[80px] font-serif`}
              style={{ colorScheme: 'light', fontSize: '0.95rem', lineHeight: '1.7' }}
              placeholder="e.g. A mustard yellow Chanderi kurta with delicate gold block print..."
            />
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2 mt-4">Mood</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Elegant','Relaxed','Edgy','Romantic','Minimalist'].map(m => (
                <Chip key={m} label={m} selected={mood === m} onToggle={() => setMood(p => p === m ? null : m)} />
              ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Season</p>
            <select value={pairSeason} onChange={e => setPairSeason(e.target.value)}
              className={`${ic} appearance-none cursor-pointer`} style={{ colorScheme: 'light' }}>
              {['Summer','Monsoon','Winter','All year'].map(s => <option key={s}>{s}</option>)}
            </select>
            <AiButton onClick={runPair} loading={loading} label="Style This Piece" />
            <Result label="StyleOut recommends —" text={results.pair} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-serif font-light text-aapta-ink text-xl mb-1">Body-Type Intelligence</h2>
            <p className="text-aapta-muted text-xs italic mb-5">"Best silhouette for your proportions."</p>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Body shape</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Pear / Triangle','Apple / Round','Hourglass','Rectangle','Inverted Triangle','Not sure'].map(s => (
                <Chip key={s} label={s} selected={shape === s} onToggle={() => setShape(p => p === s ? null : s)} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Height</p>
                <select value={bodyH} onChange={e => setBodyH(e.target.value)}
                  className={`${ic} appearance-none cursor-pointer`} style={{ colorScheme: 'light' }}>
                  {["Petite (under 5'3\")","Average (5'3\"–5'6\")","Tall (5'7\"+)"].map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Highlight</p>
                <select value={bodyHL} onChange={e => setBodyHL(e.target.value)}
                  className={`${ic} appearance-none cursor-pointer`} style={{ colorScheme: 'light' }}>
                  {['Shoulders','Waist','Hips','Legs','Arms'].map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Categories you love</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Sarees','Kurtas','Western','Fusion','Dresses','Denim'].map(c => (
                <Chip key={c} label={c} selected={cats.includes(c)} onToggle={() => toggleMulti(cats, setCats, c)} />
              ))}
            </div>
            <AiButton onClick={runBody} loading={loading} label="Find My Silhouette" />
            <Result label="Your style blueprint —" text={results.body} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-serif font-light text-aapta-ink text-xl mb-1">Personalized Recommendations</h2>
            <p className="text-aapta-muted text-xs italic mb-5">"Based on your vibe..."</p>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Style personality</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Old money','Quiet luxury','Maximalist','Boho','Streetwear','Power dressing','Ethnic fusion','Minimalist'].map(p => (
                <Chip key={p} label={p} selected={persona.includes(p)} onToggle={() => toggleMulti(persona, setPersona, p)} />
              ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Colour palette</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Neutrals','Earth tones','Pastels','Jewel tones','Monochromes','Bold brights'].map(c => (
                <Chip key={c} label={c} selected={colors.includes(c)} onToggle={() => toggleMulti(colors, setColors, c)} />
              ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Tell me more (optional)</p>
            <textarea
              value={vibeText} onChange={e => setVibeText(e.target.value)}
              className={`${ic} resize-y min-h-[72px] font-serif`}
              style={{ colorScheme: 'light', fontSize: '0.95rem', lineHeight: '1.7' }}
              placeholder="e.g. I love mixing Indian textiles with contemporary cuts..."
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Wardrobe need</p>
                <select value={vibeNeed} onChange={e => setVibeNeed(e.target.value)}
                  className={`${ic} appearance-none cursor-pointer`} style={{ colorScheme: 'light' }}>
                  {['Everyday rotation','Work wardrobe','Special occasions','Weekend wear','Travel capsule'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Budget</p>
                <select value={vibeBudget} onChange={e => setVibeBudget(e.target.value)}
                  className={`${ic} appearance-none cursor-pointer`} style={{ colorScheme: 'light' }}>
                  {['Budget-conscious','Mid-range','Investment pieces','Mixed'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <AiButton onClick={runVibe} loading={loading} label="Curate My Look" />
            <Result label="Your personal style edit —" text={results.vibe} />
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-serif font-light text-aapta-ink text-xl mb-1">Design Preview</h2>
            <p className="text-aapta-muted text-xs italic mb-5">"See it made. Try it on. Make it yours."</p>

            <div className="flex bg-aapta-warm rounded-sm p-1 mb-5">
              {['saree','inv'].map(m => (
                <button key={m} onClick={() => setDesignMode(m)}
                  className={`flex-1 py-2 text-xs tracking-widest uppercase font-sans rounded-sm transition-all ${
                    designMode === m ? 'bg-aapta-ink text-aapta-gold font-semibold' : 'text-aapta-muted'
                  }`}>
                  {m === 'saree' ? 'I have a saree' : 'Browse Aapta pieces'}
                </button>
              ))}
            </div>

            {designMode === 'saree' && (
              <div>
                <UploadBox label="Upload your saree" icon="🪡" preview={previews.saree} onChange={e => handleUpload('saree', e)} />
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2 mt-4">Describe it (optional)</p>
                <textarea
                  value={sareeDesc} onChange={e => setSareeDesc(e.target.value)}
                  className={`${ic} resize-y min-h-[72px] font-serif`}
                  style={{ colorScheme: 'light', fontSize: '0.95rem', lineHeight: '1.7' }}
                  placeholder="e.g. Burgundy Kanjivaram, gold zari border, 50 years old..."
                />
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2 mt-4">Designing for</p>
                <div className="flex gap-2 mb-4">
                  <Chip label="Women" selected={gender === 'women'} onToggle={() => setGender('women')} />
                  <Chip label="Men"   selected={gender === 'men'}   onToggle={() => setGender('men')} />
                </div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Design direction</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(gender === 'women'
                    ? ['Structured jacket','Wrap dress','Co-ord set','Crop blouse + skirt','Cape / duster','Surprise me']
                    : ['Nehru jacket','Long kurta','Bandhgala','Relaxed silk shirt','Sherwani','Surprise me']
                  ).map(d => (
                    <Chip key={d} label={d} selected={dtype === d} onToggle={() => setDtype(p => p === d ? null : d)} />
                  ))}
                </div>
              </div>
            )}

            {designMode === 'inv' && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-3">Choose a piece</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {INVENTORY.map(item => (
                    <button key={item.slug} onClick={() => setSelInv(item)}
                      className={`text-left border rounded-sm overflow-hidden transition-all ${
                        selInv?.slug === item.slug
                          ? 'border-aapta-gold border-2'
                          : 'border-aapta-gold/20 hover:border-aapta-gold/50'
                      }`}>
                      <div className="h-16" style={{ backgroundColor: item.bg }} />
                      <div className="p-2">
                        <p className="font-serif text-xs text-aapta-ink">{item.title}</p>
                        <p className="text-[10px] text-aapta-gold">{item.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <UploadBox label="Upload yourself (for try-on)" icon="🪞"
                  preview={previews.self} onChange={e => handleUpload('self', e)} />
              </div>
            )}

            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2 mt-4">Your body shape</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Pear / Triangle','Apple / Round','Hourglass','Rectangle','Inverted Triangle','Skip'].map(s => (
                <Chip key={s} label={s} selected={dshape === s} onToggle={() => setDshape(p => p === s ? null : s)} />
              ))}
            </div>

            <p className="text-[10px] tracking-widest uppercase text-aapta-muted mb-2">Occasion</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Everyday','Work','Evening','Festive','Wedding'].map(o => (
                <Chip key={o} label={o} selected={docc === o} onToggle={() => setDocc(p => p === o ? null : o)} />
              ))}
            </div>

            <AiButton onClick={runDesign} loading={loading} label="Generate Design Preview" />
            <Result label="Aapta sees three lives for this piece —" text={results.design} />
          </div>
        )}

        <div className="flex gap-3 mt-6 pt-5 border-t border-aapta-gold/15">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 text-xs tracking-widest uppercase font-sans text-aapta-muted border border-aapta-gold/20 rounded-sm hover:border-aapta-gold hover:text-aapta-ink transition-all">
              ← Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex-1 py-3 text-xs tracking-widest uppercase font-sans bg-aapta-ink text-aapta-gold rounded-sm hover:opacity-85 transition-all">
              Next →
            </button>
          ) : (
            <button onClick={() => setStep(0)}
              className="flex-1 py-3 text-xs tracking-widest uppercase font-sans bg-aapta-ink text-aapta-gold rounded-sm hover:opacity-85 transition-all">
              Start over ↺
            </button>
          )}
        </div>

      </div>
    </div>
  )
}