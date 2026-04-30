import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="stripe-bar" />

      {/* Main footer — teal halftone like the retro style */}
      <div className="halftone-teal" style={{borderTop: '3px solid var(--color-buzz-navy)'}}>
        <div style={{maxWidth: 1280, margin: '0 auto', padding: '3.5rem 1.5rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem'}}>

            {/* Brand */}
            <div>
              <div style={{marginBottom: '1rem'}}>
                <div style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', lineHeight: 1, marginBottom: 2}}>
                  THE
                </div>
                <div style={{fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', letterSpacing: '0.05em', lineHeight: 0.9, textShadow: '3px 3px 0 rgba(0,0,0,0.2)'}}>
                  BUZZ
                </div>
                <div style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-buzz-yellow)', letterSpacing: '0.2em', lineHeight: 1, marginTop: 2}}>
                  CAMPER
                </div>
              </div>
              <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 220, marginBottom: '0.75rem'}}>
                One family. One VW ID. Buzz. Two decades of camping meets one radically different EV.
              </p>
              <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase'}}>
                Southern Arizona &bull; Est. 2026
              </span>
            </div>

            {/* Explore */}
            <div>
              <div className="retro-divider" style={{marginBottom: '1rem'}}>
                <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-buzz-yellow)', whiteSpace: 'nowrap'}}>
                  &#9830; Explore &#9830;
                </span>
              </div>
              <ul style={{listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {[
                  { to: '/journal', label: 'Journey Journal' },
                  { to: '/reviews', label: 'Gear Reviews' },
                  { to: '/upgrades', label: 'Build Log' },
                  { to: '/resources', label: 'Resources' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.04em',
                      color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s',
                    }}
                    onMouseOver={e => e.target.style.color = 'var(--color-buzz-yellow)'}
                    onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                      {l.label.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <div className="retro-divider" style={{marginBottom: '1rem'}}>
                <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-buzz-yellow)', whiteSpace: 'nowrap'}}>
                  &#9830; Connect &#9830;
                </span>
              </div>
              <ul style={{listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {[
                  { to: '/about', label: 'About Us' },
                  { to: '/work-with-us', label: 'Work With Us' },
                  { to: '/review-policy', label: 'Review Policy' },
                  { to: '/register', label: 'Join Community' },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.04em',
                      color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s',
                    }}
                    onMouseOver={e => e.target.style.color = 'var(--color-buzz-yellow)'}
                    onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                      {l.label.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email */}
            <div>
              <div className="retro-divider" style={{marginBottom: '1rem'}}>
                <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-buzz-yellow)', whiteSpace: 'nowrap'}}>
                  &#9830; Stay Updated &#9830;
                </span>
              </div>
              <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: '1rem'}}>
                New reviews and trip reports, direct to your inbox.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="field-input"
                style={{background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)', color: 'white', marginBottom: '0.5rem'}}
              />
              <button className="btn-retro" style={{width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.55rem 1rem'}}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div style={{
            marginTop: '2.5rem', paddingTop: '1.5rem',
            borderTop: '1.5px dashed rgba(255,255,255,0.2)',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
          }}>
            <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em'}}>
              &copy; {new Date().getFullYear()} The Buzz Camper &mdash; thebuzzcamper.com &mdash; All reviews independently purchased unless disclosed.
            </p>
            <div style={{display: 'flex', gap: '1.5rem'}}>
              {[
                { to: '/review-policy', label: 'Review Policy' },
                { to: '/work-with-us', label: 'Media Kit' },
              ].map((l) => (
                <Link key={l.to} to={l.to} style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.06em'}}
                  onMouseOver={e => e.target.style.color = 'var(--color-buzz-yellow)'}
                  onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
