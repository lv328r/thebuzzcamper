import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
          padding: '2rem', borderBottom: '4px solid var(--color-buzz-orange)', textAlign: 'center',
        }}>
          <Link to="/" style={{textDecoration: 'none'}}>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.35em', lineHeight: 1}}>THE</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'white', letterSpacing: '0.05em', lineHeight: 0.9, textShadow: '3px 3px 0 rgba(0,0,0,0.2)'}}>BUZZ</div>
            <div style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.2em'}}>CAMPER</div>
          </Link>
          <div className="retro-divider" style={{margin: '1.25rem 0 0.5rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
              &#9830; Reset Password &#9830;
            </span>
          </div>
        </div>
        <div className="stripe-bar" />

        <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)', borderTop: 'none', padding: '2rem'}}>
          {sent ? (
            <div style={{textAlign: 'center', padding: '1rem 0'}}>
              <CheckCircle size={48} style={{color: 'var(--color-buzz-teal)', margin: '0 auto 1rem'}} />
              <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem'}}>
                CHECK YOUR EMAIL
              </h2>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A6E5A', lineHeight: 1.65, marginBottom: '1.5rem'}}>
                We sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to set a new password.
              </p>
              <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#9C8E74', letterSpacing: '0.06em', marginBottom: '1.5rem'}}>
                Didn't get it? Check your spam folder or try again.
              </p>
              <button onClick={() => setSent(false)} style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-buzz-teal)',
                background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
              }}>
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A6E5A', lineHeight: 1.65, marginBottom: '1.5rem'}}>
                Enter your account email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.1rem'}}>
                <div>
                  <label style={{display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.4rem'}}>
                    EMAIL
                  </label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required className="field-input" placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <div style={{background: '#FEF2F2', border: '2px solid #DC2626', padding: '0.75rem 1rem'}}>
                    <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#DC2626'}}>{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-retro" style={{width: '100%', justifyContent: 'center', fontSize: '1rem', opacity: loading ? 0.6 : 1}}>
                  <Mail size={15} />
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <div className="retro-divider" style={{margin: '1.5rem 0 1rem'}}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#7A6E5A', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>Remember your password?</span>
          </div>
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-buzz-navy)', textDecoration: 'none', fontWeight: 600,
          }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
