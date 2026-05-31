export default function Story() {
  return (
    <div className="bg-aapta-cream min-h-screen">
      <div className="bg-aapta-ink px-6 py-24 text-center">
        <p className="sec-label mb-4">Who we are</p>
        <h1 className="font-serif font-light text-aapta-cream mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          A mother's eye.<br />
          <span className="italic text-aapta-gold">A daughter's vision.</span>
        </h1>
        <p className="text-aapta-muted text-sm leading-relaxed max-w-md mx-auto">
          Aapta was born from a cedar chest full of sarees — and the question of what comes next.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="font-serif text-aapta-ink leading-relaxed mb-6"
          style={{ fontSize: '1.2rem', fontWeight: 300 }}>
          Every family has them — sarees wrapped in old newspaper, folded into shelves,
          too precious to discard and too delicate to wear. Aapta exists to change that.
        </p>
        <p className="text-aapta-muted text-sm leading-[1.9] mb-6">
          Our designer approaches each piece the way a sculptor approaches marble — she sees
          what it wants to become. Working with a small circle of master tailors, she
          reconstructs each textile into something wearable, contemporary, and unmistakably itself.
        </p>
        <p className="text-aapta-muted text-sm leading-[1.9] mb-10">
          No two pieces are the same. No original textile is wasted. Every garment leaves
          with a provenance card — a small document naming the fabric, its origin, and its new form.
        </p>

        <div className="grid grid-cols-3 gap-4 my-14">
          {[
            { num: '12+',   label: 'Tailors' },
            { num: '100%',  label: 'Upcycled' },
            { num: '1 of 1', label: 'Every piece' },
          ].map(s => (
            <div key={s.label} className="bg-aapta-warm rounded-sm p-6 text-center">
              <p className="font-serif font-light text-aapta-ink text-3xl mb-1">{s.num}</p>
              <p className="text-[10px] tracking-widest uppercase text-aapta-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="gold-divider mb-14" />

        <div id="process">
          <p className="sec-label mb-3">How a saree becomes an Aapta piece</p>
          <h2 className="font-serif font-light text-aapta-ink mb-10" style={{ fontSize: '1.8rem' }}>
            The transformation
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '01', title: 'Source',  body: 'We collect heirloom sarees from families across India.' },
              { num: '02', title: 'Design',  body: "Our designer studies each fabric's weave, drape, and history." },
              { num: '03', title: 'Craft',   body: 'Our tailors hand-cut and construct each garment. Zero waste.' },
              { num: '04', title: 'Yours',   body: "Each piece ships with a provenance card.", dark: true },
            ].map(s => (
              <div key={s.num} className={`rounded-sm p-6 ${s.dark ? 'bg-aapta-ink' : 'bg-aapta-warm'}`}>
                <p className={`font-serif text-4xl font-light leading-none mb-2 ${s.dark ? 'text-aapta-gold/40' : 'text-aapta-gold-light'}`}>
                  {s.num}
                </p>
                <p className={`font-serif text-sm mb-2 ${s.dark ? 'text-aapta-gold' : 'text-aapta-ink'}`}>{s.title}</p>
                <p className="text-aapta-muted text-xs leading-[1.7]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
