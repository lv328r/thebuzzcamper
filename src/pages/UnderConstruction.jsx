import { useState } from 'react';
import { Wrench, Mail, Instagram, CheckCircle } from 'lucide-react';

export default function UnderConstruction() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-buzz-navy)',
      backgroundImage: 'radial-gradient(circle, rgba(232,101,10,0.1) 1.5px, transparent 1.5px)',
      backgroundSize: '18px 18px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, border: '3px solid rgba(232,101,10,0.15)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, border: '3px solid rgba(232,101,10,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, border: '3px solid rgba(27,123,122,0.2)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{
        background: 'var(--color-buzz-cream)',
        border: '3px solid var(--color-buzz-orange)',
        boxShadow: '8px 8px 0 var(--color-buzz-orange)',
        maxWidth: 580, width: '100%',
        overflow: 'hidden',
      }}>

        {/* Top stripe */}
        <div style={{
          background: 'var(--color-buzz-orange)',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
          padding: '0.6rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['#fff', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.25)'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.8)' }}>
            THEBUZZCAMPER.COM
          </span>
        </div>

        <div style={{ padding: '2.5rem 2.5rem 2rem' }}>

          {/* Van animation */}
          <div style={{
            marginBottom: '1.75rem',
            border: '3px solid var(--color-buzz-orange)',
            boxShadow: '4px 4px 0 var(--color-buzz-navy)',
            background: '#000',
            overflow: 'hidden',
            lineHeight: 0,
          }}>
            <video
              src="/vw-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }}
            />
          </div>

          {/* Headline */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <Wrench size={16} color="var(--color-buzz-orange)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-buzz-orange)' }}>
                BUILDING SOMETHING GREAT
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 10vw, 5.5rem)',
              color: 'var(--color-buzz-navy)',
              letterSpacing: '0.03em',
              lineHeight: 0.88,
              marginBottom: '1rem',
            }}>
              THE BUZZ<br />
              <span style={{ color: 'var(--color-buzz-orange)' }}>CAMPER</span>
            </h1>
            <div style={{ width: 60, height: 4, background: 'var(--color-buzz-teal)', marginBottom: '1rem' }} />
            <p style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: '1.05rem', color: '#5A4A3A', lineHeight: 1.7,
            }}>
              Our VW ID. Buzz adventure site is currently under construction. We're wrenching on it — check back soon for build logs, gear reviews, and desert camping stories.
            </p>
          </div>

          {/* Email capture */}
          <div style={{
            background: 'var(--color-buzz-navy)',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1.5px, transparent 1.5px)',
            backgroundSize: '12px 12px',
            border: '2.5px solid var(--color-buzz-navy)',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-orange)', marginBottom: '0.75rem' }}>
              NOTIFY ME WHEN WE LAUNCH
            </p>
            {submitted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#4ADE80" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#4ADE80' }}>
                  You're on the list — we'll be in touch!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1, minWidth: 180,
                    padding: '0.6rem 0.875rem',
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    color: 'white', outline: 'none',
                  }}
                />
                <button type="submit" style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em',
                  background: 'var(--color-buzz-orange)', color: 'white',
                  border: '2px solid var(--color-buzz-orange)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: '3px 3px 0 rgba(255,255,255,0.15)',
                }}>
                  <Mail size={13} /> NOTIFY ME
                </button>
              </form>
            )}
          </div>

          {/* Social + footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a
              href="https://instagram.com/thebuzzcamper"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--color-buzz-teal)', textDecoration: 'none',
                border: '1.5px solid var(--color-buzz-teal)',
                padding: '0.4rem 0.875rem',
              }}>
              <Instagram size={13} /> @THEBUZZCAMPER
            </a>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#9C8E74', letterSpacing: '0.06em' }}>
              VW ID. BUZZ &bull; CAMPING &bull; OVERLAND
            </span>
          </div>
        </div>

        {/* Bottom stripe */}
        <div style={{ height: 6, background: 'linear-gradient(90deg, var(--color-buzz-teal) 33%, var(--color-buzz-orange) 33% 66%, var(--color-buzz-navy) 66%)' }} />
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', marginTop: '1.5rem' }}>
        &copy; 2026 THE BUZZ CAMPER &mdash; THEBUZZCAMPER.COM
      </p>
    </div>
  );
}
