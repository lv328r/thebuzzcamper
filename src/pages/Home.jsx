import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../utils/storage';
import ArticleCard from '../components/ArticleCard';
import { ArrowRight, Zap, Map, Wrench, Star, Mail } from 'lucide-react';

const PILLARS = [
  { icon: Map,    title: 'Journey\nJournal', sub: 'Trip Reports', to: '/journal',   bg: 'var(--color-buzz-teal)',   dot: 'halftone-teal' },
  { icon: Star,   title: 'Gear\nReviews',    sub: 'Honest Tests',  to: '/reviews',   bg: 'var(--color-buzz-orange)', dot: 'halftone-orange' },
  { icon: Wrench, title: 'Build\nLog',       sub: 'Upgrades',      to: '/upgrades',  bg: 'var(--color-buzz-navy)',   dot: 'halftone-navy' },
  { icon: Zap,    title: 'EV\nResources',    sub: 'Tools & Gear',  to: '/resources', bg: 'var(--color-buzz-red)',    dot: 'halftone-orange' },
];

function RetroSection({ eyebrow, title, children, bg = 'var(--color-buzz-cream)' }) {
  return (
    <section style={{background: bg, padding: '4rem 0'}}>
      <div style={{maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem'}}>
        <div className="retro-divider" style={{marginBottom: '2rem'}}>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-buzz-teal)', whiteSpace: 'nowrap'}}>
            &#9830; {eyebrow} &#9830;
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          color: typeof bg === 'string' && bg.includes('navy') ? 'white' : 'var(--color-buzz-navy)',
          textAlign: 'center', marginBottom: '2.5rem',
          letterSpacing: '0.04em', lineHeight: 0.95,
        }}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const [articles, setArticles] = useState([]);
  useEffect(() => { getArticles().then(setArticles).catch(() => {}); }, []);
  const featured = articles.filter((a) => a.featured).slice(0, 3);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={{position: 'relative', overflow: 'hidden', minHeight: 560}}>
        {/* Split background — teal left / navy right */}
        <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '55% 45%'}}>
          <div className="halftone-teal" />
          <div className="halftone-navy" />
        </div>

        {/* Hero image — right side */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '55%',
          overflow: 'hidden',
        }}>
          <img
            src="/vw-header.png"
            alt="VW ID Buzz and classic VW Bus"
            style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.85, mixBlendMode: 'luminosity'}}
          />
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--color-buzz-teal) 0%, transparent 40%)'}} />
        </div>

        {/* Decorative geometric shapes */}
        <div style={{position: 'absolute', top: 20, right: '12%', width: 80, height: 80, background: 'var(--color-buzz-orange)', opacity: 0.7, borderRadius: '50%'}} />
        <div style={{position: 'absolute', top: 60, right: '8%', width: 50, height: 50, background: 'var(--color-buzz-orange)', opacity: 0.4, borderRadius: '50%'}} />
        <div style={{position: 'absolute', bottom: 40, right: '18%', width: 30, height: 30, background: 'var(--color-buzz-yellow)', opacity: 0.6, borderRadius: '50%'}} />

        {/* Stars decorative */}
        {[{t: '15%', l: '42%', s: 24}, {t: '70%', l: '48%', s: 16}, {t: '30%', l: '52%', s: 12}].map((pos, i) => (
          <div key={i} style={{position: 'absolute', top: pos.t, left: pos.l, color: 'var(--color-buzz-yellow)', fontSize: pos.s, opacity: 0.8, fontFamily: 'serif', pointerEvents: 'none'}}>
            &#10022;
          </div>
        ))}

        {/* Content */}
        <div style={{position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '5rem 1.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '2rem'}}>
          <div>
            {/* Eyebrow ribbon */}
            <div className="ribbon ribbon-orange" style={{marginBottom: '1.25rem'}}>
              Est. 2026 &mdash; Southern Arizona
            </div>

            {/* Big display type — Hollywood / Vintwood style */}
            <div style={{marginBottom: '1rem'}}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 2vw, 1.75rem)',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.4em',
                lineHeight: 1,
                marginBottom: '0.1rem',
              }}>
                THE
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                color: 'white',
                lineHeight: 0.88,
                letterSpacing: '0.03em',
                textShadow: '4px 4px 0 rgba(0,0,0,0.25)',
              }}>
                BUZZ
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                color: 'var(--color-buzz-yellow)',
                letterSpacing: '0.25em',
                textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                lineHeight: 1.1,
              }}>
                CAMPER
              </div>
            </div>

            {/* Subtitle serif — like magazine subheading */}
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: 'rgba(245,237,204,0.85)',
              lineHeight: 1.65,
              maxWidth: 380,
              marginBottom: '2rem',
              borderLeft: '3px solid var(--color-buzz-orange)',
              paddingLeft: '1rem',
            }}>
              Daily-driving &amp; camping in a VW ID. Buzz — what we bought, what we tried, 
              and what actually works.
            </p>

            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <Link to="/journal" className="btn-retro">
                Read The Journal <ArrowRight size={16} />
              </Link>
              <Link to="/reviews" className="btn-retro btn-retro-outline">
                Gear Reviews
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="stripe-bar" style={{position: 'absolute', bottom: 0, left: 0, right: 0}} />
      </section>

      {/* ===== WHAT WE COVER ===== */}
      <section style={{background: 'var(--color-buzz-cream)', padding: '4rem 0'}}>
        <div style={{maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem'}}>
          <div className="retro-divider" style={{marginBottom: '2rem'}}>
            <span className="retro-label" style={{color: 'var(--color-buzz-teal)', whiteSpace: 'nowrap'}}>
              &#9830; What We Cover &#9830;
            </span>
          </div>
          <h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', textAlign: 'center', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '2.5rem', lineHeight: 0.95}}>
            FOUR WAYS TO EXPLORE
          </h2>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem'}}>
            {PILLARS.map(({ icon: Icon, title, sub, to, bg }) => (
              <Link key={to} to={to} style={{textDecoration: 'none', display: 'block'}}>
                <div className="retro-card retro-card-orange" style={{overflow: 'hidden'}}>
                  {/* Colored top block */}
                  <div style={{
                    background: bg,
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
                    backgroundSize: '14px 14px',
                    padding: '1.5rem',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 100,
                  }}>
                    <div style={{fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'white', lineHeight: 0.9, letterSpacing: '0.04em', whiteSpace: 'pre-line'}}>
                      {title}
                    </div>
                    <div style={{
                      width: 44, height: 44, background: 'rgba(255,255,255,0.15)',
                      border: '2px solid rgba(255,255,255,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={20} color="white" />
                    </div>
                  </div>
                  {/* Bottom */}
                  <div style={{padding: '1rem 1.25rem', background: '#FBF6E8', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-buzz-navy)'}}>
                      {sub}
                    </span>
                    <span style={{fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.04em'}}>
                      EXPLORE &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      {featured.length > 0 && (
        <section className="halftone-bg" style={{padding: '4rem 0', borderTop: '3px solid var(--color-buzz-navy)', borderBottom: '3px solid var(--color-buzz-navy)'}}>
          <div style={{maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem'}}>
            <div className="retro-divider" style={{marginBottom: '2rem'}}>
              <span className="retro-label" style={{color: 'var(--color-buzz-orange)', whiteSpace: 'nowrap'}}>
                &#9830; Editors&apos; Picks &#9830;
              </span>
            </div>
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', textAlign: 'center', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '2.5rem', lineHeight: 0.95}}>
              FEATURED POSTS
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              {featured.map((a) => <ArticleCard key={a.id} article={a} featured />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== RECENT + SIDEBAR ===== */}
      <section style={{background: 'var(--color-buzz-cream)', padding: '4rem 0'}}>
        <div style={{maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem'}}>
          <div className="retro-divider" style={{marginBottom: '2rem'}}>
            <span className="retro-label" style={{color: 'var(--color-buzz-teal)', whiteSpace: 'nowrap'}}>
              &#9830; Fresh From The Trail &#9830;
            </span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem'}} className="layout-two-col">
            {/* Posts */}
            <div>
              <h2 style={{fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '1.5rem', lineHeight: 0.95}}>
                LATEST POSTS
              </h2>
              <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)'}}>
                {articles.slice(0, 6).map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
              <div style={{marginTop: '1.25rem'}}>
                <Link to="/journal" className="btn-retro btn-retro-navy">
                  All Posts &rarr;
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block" style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* Who We Are */}
              <div className="halftone-teal" style={{padding: '1.75rem', border: '2.5px solid var(--color-buzz-navy)'}}>
                <div className="retro-divider" style={{marginBottom: '1rem', '--divider-color': 'rgba(255,255,255,0.3)'}}>
                  <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>&#9830; WHO WE ARE &#9830;</span>
                </div>
                <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '1.25rem'}}>
                  Engineer, off-grid desert dweller, and accidental EV camping evangelist.
                  Converting an ID. Buzz for real family camping use in southern Arizona.
                </p>
                <Link to="/about" className="btn-retro btn-retro-outline" style={{fontSize: '0.85rem', padding: '0.5rem 1.25rem', width: '100%', justifyContent: 'center'}}>
                  About Us
                </Link>
              </div>

              {/* Partner box */}
              <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)', padding: '1.75rem', boxShadow: '5px 5px 0 var(--color-buzz-orange)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                  <div style={{width: 28, height: 28, background: 'var(--color-buzz-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Mail size={14} color="white" />
                  </div>
                  <span className="retro-label" style={{color: 'var(--color-buzz-orange)'}}>Vendor Partnerships</span>
                </div>
                <p style={{fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-buzz-navy)', marginBottom: '0.75rem', lineHeight: 1.3}}>
                  Make gear for EV campers?
                </p>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.65, marginBottom: '1.1rem'}}>
                  We review products for the ID. Buzz niche. Small, focused audience that actually buys.
                </p>
                <Link to="/work-with-us" className="btn-retro btn-retro-navy" style={{fontSize: '0.85rem', padding: '0.5rem 1.25rem', width: '100%', justifyContent: 'center'}}>
                  Work With Us
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{
        background: 'var(--color-buzz-orange)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
        backgroundSize: '16px 16px',
        borderTop: '3px solid var(--color-buzz-navy)',
        borderBottom: '3px solid var(--color-buzz-navy)',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Big decorative circles */}
        <div style={{position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.15)'}} />
        <div style={{position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.12)'}} />
        <div style={{position: 'relative', zIndex: 1}}>
          <div className="retro-divider" style={{marginBottom: '1.25rem', maxWidth: 500, margin: '0 auto 1.25rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap'}}>
              &#9830; Join The Community &#9830;
            </span>
          </div>
          <h2 style={{fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: 'white', letterSpacing: '0.04em', lineHeight: 0.9, marginBottom: '1.25rem', textShadow: '3px 3px 0 rgba(0,0,0,0.15)'}}>
            GOT AN ID. BUZZ?<br />SHARE YOUR STORY.
          </h2>
          <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', maxWidth: 420, margin: '0 auto 2rem', lineHeight: 1.65}}>
            Register to leave comments, share upgrades, and connect with other owners asking the same questions.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link to="/register" className="btn-retro btn-retro-navy">Create Free Account</Link>
            <Link to="/work-with-us" className="btn-retro btn-retro-outline">Vendor Partnerships</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1023px) {
          .layout-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
