import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function CountUp({ target, prefix = '', suffix = '', duration = 1800 }) {
  const [ref, visible] = useInView(0.3)
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, target, duration])
  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>
}

function FadeSection({ children, delay = 0, style }) {
  const [ref, visible] = useInView(0.1)
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

const painCards = [
  {
    icon: '📊',
    text: 'Your teams reconcile by email and Excel. Reports never match.',
  },
  {
    icon: '🔥',
    text: 'Chargebacks are eating your margin. You can\'t even identify the root cause.',
  },
  {
    icon: '⏳',
    text: 'Refunds take days because nobody agrees on the numbers.',
  },
]

const solutionCards = [
  {
    title: 'Single Ledger',
    desc: 'One immutable record across every provider, merchant, and currency. All teams aligned, zero discrepancies.',
    icon: '📒',
    color: '#10B981',
  },
  {
    title: 'Chargeback Intelligence',
    desc: 'Upload your file, get root cause analysis in seconds. Auto-categorization, repeat offender detection, AI recommendations.',
    icon: '🛡️',
    color: '#60A5FA',
  },
  {
    title: 'Instant Refunds',
    desc: 'Atomic reversals with full audit trail. Smart confidence scoring, auto-resolve eligible cases. Zero reconciliation errors.',
    icon: '⚡',
    color: '#FBBF24',
  },
]

const steps = [
  { num: '01', title: 'Connect', desc: 'Plug into your existing payment providers via API. Stripe, Adyen, dLocal, Mercado Pago — all normalized into one data model.' },
  { num: '02', title: 'Settle', desc: 'Real-time settlement engine processes transactions in under 2 seconds. Automatic matching, instant ledger updates.' },
  { num: '03', title: 'Reconcile', desc: 'Continuous reconciliation replaces manual cycles. Exceptions surface automatically with root cause analysis.' },
]

export default function Landing() {
  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 100); return () => clearTimeout(t) }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#06090F', overflowX: 'hidden' }}>
      {/* BG grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 40px', position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(33, 38, 45, 0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #10B981, #60A5FA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#fff',
            fontFamily: "'JetBrains Mono', monospace",
          }}>S</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#E6EDF3' }}>Settlement Engine</span>
        </div>
        <Link to="/demo" style={{
          padding: '8px 20px', borderRadius: 8, border: '1px solid #21262D',
          background: 'transparent', color: '#E6EDF3', fontSize: 13,
          fontWeight: 500, textDecoration: 'none',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'border-color 0.2s',
        }}>
          Live Demo →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: 900, margin: '0 auto',
        padding: '120px 40px 80px',
        textAlign: 'center',
      }}>
        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 20,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: 13, color: '#10B981', fontWeight: 500,
            marginBottom: 32,
          }}>
            Enterprise Settlement Infrastructure
          </div>
        </div>

        <h1 style={{
          fontSize: 64, fontWeight: 700, lineHeight: 1.05,
          color: '#E6EDF3', letterSpacing: '-0.03em',
          margin: '0 0 24px',
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
        }}>
          Settlement in Seconds.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #10B981, #60A5FA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Not Days.</span>
        </h1>

        <p style={{
          fontSize: 19, color: '#8B949E', lineHeight: 1.6,
          maxWidth: 640, margin: '0 auto 48px',
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
        }}>
          Enterprise settlement infrastructure that eliminates manual reconciliation,
          kills chargebacks, and gives your finance team one source of truth.
        </p>

        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s',
        }}>
          <Link to="/demo" style={{
            display: 'inline-block',
            padding: '14px 36px', borderRadius: 10,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#fff', fontSize: 16, fontWeight: 600,
            textDecoration: 'none',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 4px 24px rgba(16, 185, 129, 0.25)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 32px rgba(16, 185, 129, 0.35)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 24px rgba(16, 185, 129, 0.25)' }}
          >
            See Live Demo
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 48,
          marginTop: 72, paddingTop: 40,
          borderTop: '1px solid #21262D',
          opacity: heroReady ? 1 : 0,
          transition: 'opacity 0.6s ease 0.6s',
        }}>
          {[
            { value: <CountUp target={99} suffix="%" />, label: 'Match Rate' },
            { value: <CountUp target={400} suffix="+" />, label: 'Providers Supported' },
            { value: <CountUp target={3} suffix="s" />, label: 'Avg Settlement' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 36, fontWeight: 700,
                background: 'linear-gradient(135deg, #10B981, #60A5FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#484F58', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 40px' }}>
        <FadeSection>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#F87171', marginBottom: 12,
            }}>The Problem</h2>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#E6EDF3', letterSpacing: '-0.02em' }}>
              Sound familiar?
            </p>
          </div>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {painCards.map((card, i) => (
            <FadeSection key={i} delay={i * 0.12}>
              <div style={{
                padding: '32px 28px', borderRadius: 12,
                border: '1px solid rgba(248, 113, 113, 0.15)',
                background: 'rgba(248, 113, 113, 0.03)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.15)' }}
              >
                <div style={{ fontSize: 28, marginBottom: 16 }}>{card.icon}</div>
                <p style={{ fontSize: 16, color: '#C9D1D9', lineHeight: 1.6 }}>
                  "{card.text}"
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Solution Section */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 40px' }}>
        <FadeSection>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#10B981', marginBottom: 12,
            }}>The Solution</h2>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#E6EDF3', letterSpacing: '-0.02em' }}>
              One engine. Every answer.
            </p>
          </div>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {solutionCards.map((card, i) => (
            <FadeSection key={i} delay={i * 0.12}>
              <div style={{
                padding: '32px 28px', borderRadius: 12,
                border: '1px solid #21262D',
                background: '#0D1117',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = card.color }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#21262D' }}
              >
                <div style={{ fontSize: 28, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{
                  fontSize: 18, fontWeight: 700, color: card.color,
                  marginBottom: 10,
                }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 40px' }}>
        <FadeSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#60A5FA', marginBottom: 12,
            }}>How It Works</h2>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#E6EDF3', letterSpacing: '-0.02em' }}>
              Three steps to zero friction
            </p>
          </div>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {steps.map((step, i) => (
            <FadeSection key={i} delay={i * 0.15}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 56, fontWeight: 700,
                  color: 'rgba(96, 165, 250, 0.08)',
                  lineHeight: 1, marginBottom: 12,
                }}>{step.num}</div>
                <h3 style={{
                  fontSize: 20, fontWeight: 700, color: '#E6EDF3',
                  marginBottom: 10,
                }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <FadeSection>
          <div style={{
            maxWidth: 700, margin: '0 auto',
            padding: '60px 48px', borderRadius: 16,
            border: '1px solid #21262D',
            background: 'linear-gradient(180deg, #0D1117 0%, rgba(16, 185, 129, 0.04) 100%)',
          }}>
            <h2 style={{
              fontSize: 36, fontWeight: 700, color: '#E6EDF3',
              letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              Ready to settle it?
            </h2>
            <p style={{
              fontSize: 16, color: '#8B949E', marginBottom: 36, lineHeight: 1.6,
            }}>
              Built by FoundryDocs — embedded product teams for enterprise.
              <br />We build the systems your team needs, then hand you the keys.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Link to="/demo" style={{
                padding: '14px 32px', borderRadius: 10,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff', fontSize: 15, fontWeight: 600,
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 4px 24px rgba(16, 185, 129, 0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)' }}
              >
                See Live Demo
              </Link>
              <a href="mailto:simon@foundrydocs.com" style={{
                padding: '14px 32px', borderRadius: 10,
                border: '1px solid #21262D',
                background: 'transparent',
                color: '#E6EDF3', fontSize: 15, fontWeight: 500,
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => { e.target.style.borderColor = '#10B981' }}
                onMouseLeave={e => { e.target.style.borderColor = '#21262D' }}
              >
                Book a Demo
              </a>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 40px', borderTop: '1px solid #21262D',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'linear-gradient(135deg, #10B981, #60A5FA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
            fontFamily: "'JetBrains Mono', monospace",
          }}>S</div>
          <span style={{ fontSize: 13, color: '#484F58' }}>
            Built by <span style={{ color: '#8B949E', fontWeight: 500 }}>FoundryDocs</span> — embedded product teams for enterprise
          </span>
        </div>
        <span style={{ fontSize: 12, color: '#484F58' }}>
          © {new Date().getFullYear()} Settlement Engine
        </span>
      </footer>
    </div>
  )
}
