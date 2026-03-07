// Color palette preview — visit /color-preview to evaluate before applying site-wide
// Palette: steel blue #81A6C6 | light blue-grey #AACDDC | warm cream #F3E3D0 | warm taupe #D2C4B4

const P = {
  steel: '#81A6C6',
  blueGrey: '#AACDDC',
  cream: '#F3E3D0',
  taupe: '#D2C4B4',
}

export default function ColorPreviewPage() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '60px 24px', fontFamily: 'system-ui, sans-serif', color: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <h1 style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.blueGrey, marginBottom: 8 }}>
          Color Palette Preview
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 60 }}>
          Visit this page to evaluate the new palette before applying it site-wide.
        </p>

        {/* Section A — Swatches */}
        <Section label="A — Palette Swatches">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { hex: P.steel, name: 'Steel Blue', role: 'Primary accent' },
              { hex: P.blueGrey, name: 'Light Blue-Grey', role: 'Secondary accent' },
              { hex: P.cream, name: 'Warm Cream', role: 'Body text / warm highlight' },
              { hex: P.taupe, name: 'Warm Taupe', role: 'Muted text / subtle elements' },
            ].map(s => (
              <div key={s.hex} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 120, height: 80, borderRadius: 12, background: s.hex }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: s.hex }}>{s.hex}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{s.name}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{s.role}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Section B — Section label + Heading */}
        <Section label="B — Section Label + Heading">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.steel, marginBottom: 12 }}>
            About Me
          </p>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Building the Future
          </h2>
        </Section>

        {/* Section C — Cards */}
        <Section label="C — Availability Card">
          <div style={{
            border: `1px solid ${P.steel}80`,
            background: `rgba(129,166,198,0.04)`,
            borderRadius: 24,
            padding: 32,
            maxWidth: 480,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: '#10b981', textTransform: 'uppercase', margin: 0 }}>Available</p>
            </div>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Open for Collaborations</h4>

            {[
              { label: 'Location', value: 'IIT Jodhpur, India' },
              { label: 'Experience', value: '5+ Years in Industry' },
              { label: 'Work Style', value: 'Global Remote' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: P.steel, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: P.taupe, letterSpacing: '0.2em', textTransform: 'uppercase', width: 100 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{row.value}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              {['SaaS Architecture', 'Cloud Native', 'Web3'].map(t => (
                <span key={t} style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: `1px solid ${P.blueGrey}30`,
                  color: P.blueGrey,
                  fontSize: 11,
                  fontWeight: 500,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Section D — Buttons */}
        <Section label="D — Buttons">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <button style={{
              padding: '16px 32px',
              background: '#fff',
              color: '#000',
              borderRadius: 999,
              border: 'none',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}>
              MAIL ME (unchanged)
            </button>

            <button style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, rgba(200,200,220,0.25) 0%, rgba(255,255,255,0.10) 100%)',
              border: `1px solid ${P.steel}40`,
              color: '#fff',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}>
              My Journey →
            </button>

            <button style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: `1px solid rgba(255,255,255,0.1)`,
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              ↗
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>
            Social icon hover border would use {P.steel}
          </p>
        </Section>

        {/* Section E — Nav mode chip */}
        <Section label="E — Navigation Mode Chip">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: P.steel }}>Full Stack</span>
          </div>
        </Section>

        {/* Section F — Project card accent */}
        <Section label="F — Project Card Accent">
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: 24,
            maxWidth: 360,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: 999,
                background: `${P.steel}20`,
                border: `1px solid ${P.steel}30`,
                color: P.steel,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}>
                SaaS
              </span>
              <span style={{
                fontSize: 48,
                fontWeight: 900,
                background: `linear-gradient(135deg, ${P.steel}, ${P.blueGrey})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}>
                01
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Project Title</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Short description of the project goes here.</p>
          </div>
        </Section>

        {/* Section G — Body text comparison */}
        <Section label="G — Body Text Comparison">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Current: rgba(255,255,255,0.7)
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                Open to immersive product mandates that demand architectural thinking, cinematic interfaces, and measurable business impact. Research-led, execution-heavy.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                New: Warm Cream {P.cream}
              </p>
              <p style={{ color: P.cream, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                Open to immersive product mandates that demand architectural thinking, cinematic interfaces, and measurable business impact. Research-led, execution-heavy.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Current muted: rgba(255,255,255,0.4)
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                Location • Experience • Work Style labels appear at this opacity throughout the site.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                New muted: Warm Taupe {P.taupe}
              </p>
              <p style={{ color: P.taupe, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                Location • Experience • Work Style labels appear at this opacity throughout the site.
              </p>
            </div>
          </div>
        </Section>

        <div style={{ marginTop: 80, padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
            If you like this palette, say "apply it" and it will be rolled out across the site.
            If not, describe what to change and we&apos;ll iterate here first.
          </p>
        </div>

      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 64 }}>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 24, fontWeight: 700 }}>
        {label}
      </p>
      {children}
    </div>
  )
}
