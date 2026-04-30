import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the reset link is clicked
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    // Also check if we already have a session from the link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="halftone-bg" style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem'}}>
      <div style={{width: '100%', maxWidth: 420}}>
        <div style={{
          background: 'var(--color-buzz-navy)',
          backgroundImage: 'radial-gradient(circle, rgba(232,101,10,0.1) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
          padding: '2rem', borderBottom: '4px solid var(--color-buzz-orange)', textAlign: 'center',
        }}>
          <Link to="/" style={{textDecoration: 'none'}}>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.35em', lineHeight: 1}}>THE</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', letterSpacing: '0.05em', lineHeight: 0.9, textShadow: '3px 3px 0 rgba(0,0,0,0.2)'}}>BUZZ</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.2em'}}>CAMPER</div>
          </Link>
          <div className="retro-divider" style={{margin: '1.25rem 0 0.5rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
              &#9830; New Password &#9830;
            </span>
          </div>
        </div>
        <div className="stripe-bar" />

        <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)', borderTop: 'none', padding: '2rem'}}>
          {done ? (
            <div style={{textAlign: 'center', padding: '1rem 0'}}>
              <CheckCircle size={48} style={{color: 'var(--color-buzz-teal)', margin: '0 auto 1rem'}} />
              <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem'}}>
                PASSWORD UPDATED
              </h2>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A6E5A'}}>
                Your password has been changed. Redirecting you home...
              </p>
            </div>
          ) : !ready ? (
            <div style={{textAlign: 'center', padding: '1rem 0'}}>
              <AlertTriangle size={40} style={{color: 'var(--color-buzz-orange)', margin: '0 auto 1rem'}} />
              <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem'}}>
                INVALID LINK
              </h2>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#7A6E5A', marginBottom: '1.5rem'}}>
                This reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/forgot-password" className="btn-retro" style={{display: 'inline-flex'}}>
                Request New Link
              </Link>
            </div>
          ) : (
            <>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A6E5A', marginBottom: '1.5rem'}}>
                Choose a strong new password for your account.
              </p>
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.1rem'}}>
                {[
                  { key: 'password', label: 'New Password', val: password, set: setPassword },
                  { key: 'confirm', label: 'Confirm Password', val: confirm, set: setConfirm },
                ].map(({ key, label, val, set }) => (
                  <div key={key}>
                    <label style={{display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.4rem'}}>
                      {label.toUpperCase()}
                    </label>
                    <input type="password" value={val} onChange={(e) => set(e.target.value)} required className="field-input" placeholder="••••••••" />
                  </div>
                ))}

                {error && (
                  <div style={{background: '#FEF2F2', border: '2px solid #DC2626', padding: '0.75rem 1rem'}}>
                    <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#DC2626'}}>{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-retro" style={{width: '100%', justifyContent: 'center', fontSize: '1rem', opacity: loading ? 0.6 : 1}}>
                  <Lock size={15} />
                  {loading ? 'Updating...' : 'Set New Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
