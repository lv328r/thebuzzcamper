import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="halftone-bg" style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem'}}>
      <div style={{width: '100%', maxWidth: 420}}>
        {/* Header */}
        <div style={{
          background: 'var(--color-buzz-navy)',
          backgroundImage: 'radial-gradient(circle, rgba(232,101,10,0.1) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
          padding: '2rem',
          borderBottom: '4px solid var(--color-buzz-orange)',
          textAlign: 'center',
        }}>
          <Link to="/" style={{textDecoration: 'none'}}>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.35em', lineHeight: 1}}>THE</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', letterSpacing: '0.05em', lineHeight: 0.9, textShadow: '3px 3px 0 rgba(0,0,0,0.2)'}}>BUZZ</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-buzz-yellow)', letterSpacing: '0.2em'}}>CAMPER</div>
          </Link>
          <div className="retro-divider" style={{margin: '1.25rem 0 0.5rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
              &#9830; Sign In &#9830;
            </span>
          </div>
        </div>
        <div className="stripe-bar" />

        {/* Form */}
        <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)', borderTop: 'none', padding: '2rem'}}>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
            {[
              { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••' },
            ].map(({ label, type, val, set, ph }) => (
              <div key={label}>
                <label style={{display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.4rem'}}>
                  {label.toUpperCase()}
                </label>
                <input type={type} value={val} onChange={(e) => set(e.target.value)} required className="field-input" placeholder={ph} />
              </div>
            ))}

            {error && (
              <div style={{background: '#FEF2F2', border: '2px solid #DC2626', padding: '0.75rem 1rem'}}>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#DC2626'}}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-retro" style={{width: '100%', fontSize: '1rem', opacity: loading ? 0.6 : 1}}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="retro-divider" style={{margin: '1.5rem 0 1rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#7A6E5A', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>No account?</span>
          </div>

          <Link to="/register" className="btn-retro btn-retro-navy" style={{width: '100%', fontSize: '0.95rem', justifyContent: 'center'}}>
            Create Free Account
          </Link>

          <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', textAlign: 'center', marginTop: '1.25rem', letterSpacing: '0.06em'}}>
            Demo: paul@thebuzzcamper.com / admin2026
          </p>
        </div>
      </div>
    </div>
  );
}
