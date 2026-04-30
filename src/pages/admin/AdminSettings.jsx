import { useState, useEffect } from 'react';
import AdminLayout, { AdminPageHeader } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Save, CheckCircle, Globe, Mail, Lock, User, ExternalLink } from 'lucide-react';

function Section({ title, color = 'var(--color-buzz-orange)', children }) {
  return (
    <div style={{border: '2.5px solid var(--color-buzz-navy)', boxShadow: `4px 4px 0 ${color}`, background: '#FBF6E8', overflow: 'hidden', marginBottom: '1.5rem'}}>
      <div style={{background: 'var(--color-buzz-navy)', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)', backgroundSize: '12px 12px', padding: '0.625rem 1.25rem'}}>
        <span style={{fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', color}}>{title.toUpperCase()}</span>
      </div>
      <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem'}}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={{display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.35rem'}}>
        {label.toUpperCase()}
      </label>
      {children}
      {hint && <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', marginTop: '0.3rem', letterSpacing: '0.04em'}}>{hint}</p>}
    </div>
  );
}

function SaveBar({ saving, saved, onSave }) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
      <button onClick={onSave} disabled={saving} className="btn-retro" style={{opacity: saving ? 0.6 : 1}}>
        <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {saved && (
        <span style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-buzz-teal)', letterSpacing: '0.06em'}}>
          <CheckCircle size={14} /> Saved!
        </span>
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { user } = useAuth();

  // Profile state
  const [profile, setProfile] = useState({ username: '', bio: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password state
  const [pwForm, setPwForm] = useState({ current: '', password: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('username, bio').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setProfile({ username: data.username || '', bio: data.bio || '' });
      });
  }, [user]);

  async function saveProfile() {
    setProfileError('');
    setProfileSaving(true);
    try {
      const { error } = await supabase.from('profiles')
        .update({ username: profile.username, bio: profile.bio })
        .eq('id', user.id);
      if (error) throw error;
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  }

  async function savePassword() {
    setPwError('');
    if (pwForm.password !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    if (pwForm.password.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    setPwSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwForm.password });
      if (error) throw error;
      setPwSaved(true);
      setPwForm({ current: '', password: '', confirm: '' });
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Settings"
        subtitle="Manage your account and site configuration"
      />

      <div style={{padding: '2rem', maxWidth: 760}}>

        {/* Account info */}
        <Section title="Your Account" color="var(--color-buzz-teal)">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: '#F0EAD6', border: '1.5px solid #C9BEA0'}}>
            <div style={{width: 44, height: 44, background: 'var(--color-buzz-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'white', flexShrink: 0}}>
              {(user?.username || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-buzz-navy)'}}>{user?.username}</p>
              <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#7A6E5A', letterSpacing: '0.04em'}}>{user?.email}</p>
              <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2}}>{user?.role}</p>
            </div>
          </div>

          <Field label="Display Name">
            <input type="text" value={profile.username} onChange={(e) => setProfile((p) => ({...p, username: e.target.value}))}
              className="field-input" placeholder="Your display name" />
          </Field>

          <Field label="Bio" hint="Shown on your author profile">
            <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({...p, bio: e.target.value}))}
              rows={3} className="field-input" style={{resize: 'vertical', fontFamily: 'var(--font-sans)'}}
              placeholder="Engineer, off-grid desert dweller, daily-driving an ID. Buzz..." />
          </Field>

          {profileError && <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#DC2626'}}>{profileError}</p>}
          <SaveBar saving={profileSaving} saved={profileSaved} onSave={saveProfile} />
        </Section>

        {/* Change password */}
        <Section title="Change Password" color="var(--color-buzz-navy)">
          <Field label="New Password" hint="Minimum 6 characters">
            <input type="password" value={pwForm.password} onChange={(e) => setPwForm((p) => ({...p, password: e.target.value}))}
              className="field-input" placeholder="••••••••" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({...p, confirm: e.target.value}))}
              className="field-input" placeholder="••••••••" />
          </Field>
          {pwError && <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#DC2626'}}>{pwError}</p>}
          <SaveBar saving={pwSaving} saved={pwSaved} onSave={savePassword} />
        </Section>

        {/* Quick links */}
        <Section title="Supabase Management" color="var(--color-buzz-orange)">
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#7A6E5A'}}>
            Manage your database, auth settings, and storage directly in Supabase.
          </p>
          {[
            { label: 'Auth Users', href: 'https://supabase.com/dashboard/project/eebrpirglcuwmazfqofj/auth/users', desc: 'View, confirm, and delete users' },
            { label: 'Database Tables', href: 'https://supabase.com/dashboard/project/eebrpirglcuwmazfqofj/editor', desc: 'Browse articles, comments, profiles' },
            { label: 'Storage Bucket', href: 'https://supabase.com/dashboard/project/eebrpirglcuwmazfqofj/storage/buckets/images', desc: 'View and manage uploaded images' },
            { label: 'Auth Settings', href: 'https://supabase.com/dashboard/project/eebrpirglcuwmazfqofj/auth/url-configuration', desc: 'URL config, email templates, providers' },
          ].map(({ label, href, desc }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem 1rem', background: '#F0EAD6', border: '1.5px solid #C9BEA0',
              textDecoration: 'none', transition: 'all 0.12s',
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-buzz-teal)'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#C9BEA0'}
            >
              <div>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-buzz-navy)'}}>{label}</p>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A6E5A'}}>{desc}</p>
              </div>
              <ExternalLink size={14} style={{color: '#9C8E74', flexShrink: 0}} />
            </a>
          ))}
        </Section>

        {/* Danger zone */}
        <div style={{border: '2.5px solid #DC2626', boxShadow: '4px 4px 0 #991B1B', background: '#FBF6E8', overflow: 'hidden'}}>
          <div style={{background: '#DC2626', padding: '0.625rem 1.25rem'}}>
            <span style={{fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', color: 'white'}}>DANGER ZONE</span>
          </div>
          <div style={{padding: '1.25rem 1.5rem'}}>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#7A6E5A', marginBottom: '1rem'}}>
              To promote a user to admin or delete users, go to the Users section of the admin panel, or manage directly via Supabase.
            </p>
            <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
              <a href="/admin/users" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.04em',
                background: '#FBF6E8', color: '#DC2626', border: '2px solid #DC2626',
                boxShadow: '2px 2px 0 #991B1B', textDecoration: 'none',
              }}>
                <User size={14} /> Manage Users
              </a>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
