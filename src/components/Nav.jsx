import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, PenSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/journal', label: 'Journal' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/upgrades', label: 'Build Log' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
  { to: '/work-with-us', label: 'Work With Us' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthor } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header style={{position: 'sticky', top: 0, zIndex: 50}}>
      {/* Top bar */}
      <div style={{
        background: 'var(--color-buzz-navy)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.35rem 1.5rem',
        gap: '1rem',
      }}>
        <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,237,204,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase'}}>
          Daily-driving &amp; camping in a VW ID. Buzz &mdash; Southern Arizona
        </span>
        <div style={{display: 'flex', gap: '1.25rem', alignItems: 'center', flexShrink: 0}}>
          {user ? (
            <button onClick={handleLogout} style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,237,204,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4}}>
              <LogOut size={10} /> Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,237,204,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none'}}>Sign In</Link>
              <Link to="/register" style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none'}}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Main nav — cream background like Vintwood */}
      <nav style={{
        background: 'var(--color-buzz-cream)',
        borderBottom: '3px solid var(--color-buzz-navy)',
        position: 'relative',
      }}>
        {/* Subtle halftone row */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(27,58,75,0.07) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }} />

        <div style={{maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68}}>

            {/* Logo — badge style */}
            <Link to="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0}}>
              {/* Shield badge */}
              <div style={{
                width: 48, height: 52, position: 'relative', flexShrink: 0,
                background: 'var(--color-buzz-orange)',
                clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
                border: '2px solid var(--color-buzz-navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 6,
              }}>
                <span style={{fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'white', letterSpacing: '0.05em'}}>VW</span>
              </div>
              <div style={{lineHeight: 1}}>
                <div style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.05em', lineHeight: 0.9}}>
                  THE BUZZ
                </div>
                <div style={{fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.12em', lineHeight: 1, marginTop: 2}}>
                  CAMPER
                </div>
              </div>
            </Link>

            {/* Desktop nav — dot-separated like Vintwood */}
            <div className="hidden md:flex" style={{alignItems: 'center', gap: 0}}>
              {navLinks.map((link, i) => (
                <div key={link.to} style={{display: 'flex', alignItems: 'center'}}>
                  {i > 0 && (
                    <span style={{color: 'var(--color-buzz-orange)', fontSize: '0.5rem', margin: '0 0.5rem', lineHeight: 1}}>&#9679;</span>
                  )}
                  <NavLink
                    to={link.to}
                    style={({isActive}) => ({
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--color-buzz-orange)' : 'var(--color-buzz-navy)',
                      textDecoration: 'none',
                      padding: '0.35rem 0.5rem',
                      borderBottom: isActive ? '2.5px solid var(--color-buzz-orange)' : '2.5px solid transparent',
                      transition: 'color 0.15s',
                    })}
                  >
                    {link.label}
                  </NavLink>
                </div>
              ))}
            </div>

            {/* Right — CTA + user */}
            <div className="hidden md:flex" style={{alignItems: 'center', gap: '0.75rem', flexShrink: 0}}>
              {isAuthor && (
                <Link to="/admin/new" className="btn-retro" style={{fontSize: '0.85rem', padding: '0.45rem 1rem', gap: '0.35rem'}}>
                  <PenSquare size={13} /> New Post
                </Link>
              )}
              {user ? (
                <div style={{
                  width: 34, height: 34, background: 'var(--color-buzz-teal)',
                  border: '2px solid var(--color-buzz-navy)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white',
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Link to="/register" className="btn-retro" style={{fontSize: '0.85rem', padding: '0.45rem 1.1rem'}}>
                  Join Free
                </Link>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
              style={{background: 'none', border: '2px solid var(--color-buzz-navy)', padding: '0.3rem', color: 'var(--color-buzz-navy)', cursor: 'pointer'}}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: 'var(--color-buzz-cream)', borderTop: '2px solid var(--color-buzz-navy)',
            padding: '1rem 1.5rem 1.5rem',
          }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={({isActive}) => ({
                  display: 'block', padding: '0.5rem 0',
                  fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: isActive ? 'var(--color-buzz-orange)' : 'var(--color-buzz-navy)',
                  textDecoration: 'none', borderBottom: '1px dashed rgba(27,58,75,0.2)',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <div style={{marginTop: '1rem', display: 'flex', gap: '0.75rem'}}>
              {user ? (
                <button onClick={handleLogout} className="btn-retro" style={{fontSize: '0.85rem', padding: '0.5rem 1rem'}}>Sign Out</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-retro btn-retro-navy" style={{fontSize: '0.85rem', padding: '0.5rem 1rem'}}>Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-retro" style={{fontSize: '0.85rem', padding: '0.5rem 1rem'}}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Stripe accent */}
      <div className="stripe-bar" />
    </header>
  );
}
