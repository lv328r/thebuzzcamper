import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(f) { return (e) => setForm((p) => ({ ...p, [f]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try { await register(form.email, form.password, form.username); navigate('/', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const fields = [
    { key: 'username', label: 'Username', type: 'text', ph: 'VanlifeVan' },
    { key: 'email', label: 'Email', type: 'email', ph: 'you@example.com' },
    { key: 'password', label: 'Password', type: 'password', ph: '••••••••' },
    { key: 'confirm', label: 'Confirm Password', type: 'password', ph: '••••••••' },
  ];

  return (
    <div className="halftone-bg" style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem'}}>
      <div style={{width: '100%', maxWidth: 420}}>
        <div style={{
          background: 'var(--color-buzz-teal)',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
          padding: '2rem', borderBottom: '4px solid var(--color-buzz-navy)', textAlign: 'center',
        }}>
          <Link to="/" style={{textDecoration: 'none'}}>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.35em', lineHeight: 1}}>THE</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', letterSpacing: '0.05em', lineHeight: 0.9, textShadow: '3px 3px 0 rgba(0,0,0,0.15)'}}>BUZZ</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em'}}>CAMPER</div>
          </Link>
          <div className="retro-divider" style={{margin: '1.25rem 0 0.5rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
              &#9830; Join The Community &#9830;
            </span>
          </div>
        </div>
        <div className="stripe-bar" />

        <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)', borderTop: 'none', padding: '2rem'}}>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.1rem'}}>
            {fields.map(({ key, label, type, ph }) => (
              <div key={key}>
                <label style={{display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.4rem'}}>
                  {label.toUpperCase()}
                </label>
                <input type={type} value={form[key]} onChange={update(key)} required className="field-input" placeholder={ph} />
              </div>
            ))}

            {error && (
              <div style={{background: '#FEF2F2', border: '2px solid #DC2626', padding: '0.75rem 1rem'}}>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#DC2626'}}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-retro btn-retro-teal" style={{width: '100%', fontSize: '1rem', opacity: loading ? 0.6 : 1}}>
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <div className="retro-divider" style={{margin: '1.5rem 0 1rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#7A6E5A', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>Already have an account?</span>
          </div>

          <Link to="/login" className="btn-retro btn-retro-navy" style={{width: '100%', fontSize: '0.95rem', justifyContent: 'center'}}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
