import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, Star, Wrench, MessageSquare,
  Users, PenSquare, Settings, LogOut, ChevronRight, Home,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/articles', label: 'All Posts', icon: FileText },
      { to: '/admin/new', label: 'New Post', icon: PenSquare },
      { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/admin/users', label: 'Users', icon: Users },
    ],
  },
];

const SECTION_COLORS = {
  journal: { label: 'Journal', color: 'var(--color-buzz-teal)' },
  review:  { label: 'Review',  color: 'var(--color-buzz-orange)' },
  upgrade: { label: 'Build',   color: 'var(--color-buzz-navy)' },
};

export default function AdminLayout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
        <div style={{textAlign: 'center'}}>
          <p style={{fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em'}}>ACCESS DENIED</p>
          <p style={{fontFamily: 'var(--font-sans)', color: '#7A6E5A', marginTop: '0.5rem'}}>Admin access required.</p>
          <Link to="/" className="btn-retro" style={{marginTop: '1.5rem', display: 'inline-flex'}}>Go Home</Link>
        </div>
      </div>
    );
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div style={{display: 'flex', minHeight: 'calc(100vh - 110px)', background: '#F0EAD6'}}>
      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--color-buzz-navy)',
        backgroundImage: 'radial-gradient(circle, rgba(232,101,10,0.08) 1.5px, transparent 1.5px)',
        backgroundSize: '14px 14px',
        borderRight: '3px solid var(--color-buzz-orange)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 110, height: 'calc(100vh - 110px)', overflowY: 'auto',
      }}>
        {/* Sidebar header */}
        <div style={{
          padding: '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'white', letterSpacing: '0.06em', lineHeight: 1}}>
            ADMIN
          </div>
          <div style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 3}}>
            Site Management
          </div>
          {user && (
            <div style={{
              marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px dashed rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: '0.625rem',
            }}>
              <div style={{
                width: 30, height: 30, background: 'var(--color-buzz-orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white', flexShrink: 0,
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{minWidth: 0}}>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {user.username}
                </p>
                <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.1em', textTransform: 'uppercase'}}>
                  {user.role}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <nav style={{flex: 1, padding: '0.75rem 0'}}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{marginBottom: '0.25rem'}}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', padding: '0.5rem 1.25rem 0.25rem',
              }}>
                {group.label}
              </p>
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.55rem 1.25rem',
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(232,101,10,0.2)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--color-buzz-orange)' : '3px solid transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div style={{padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
          }}>
            <Home size={14} /> View Site
          </Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', padding: 0,
          }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{flex: 1, minWidth: 0, overflowY: 'auto'}}>
        {children}
      </main>
    </div>
  );
}

/* Reusable admin page header */
export function AdminPageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      background: 'var(--color-buzz-cream)',
      borderBottom: '3px solid var(--color-buzz-navy)',
      padding: '1.5rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <div>
        <h1 style={{fontFamily: 'var(--font-display)', fontSize: '2.25rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)', lineHeight: 1, marginBottom: subtitle ? '0.25rem' : 0}}>
          {title.toUpperCase()}
        </h1>
        {subtitle && (
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#7A6E5A'}}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* Reusable stat card */
export function StatCard({ label, value, icon: Icon, color = 'var(--color-buzz-orange)', sub }) {
  return (
    <div style={{
      background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)',
      boxShadow: `4px 4px 0 ${color}`,
      padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <div style={{width: 48, height: 48, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Icon size={22} color="white" />
      </div>
      <div>
        <p style={{fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-buzz-navy)', lineHeight: 0.9, letterSpacing: '0.03em'}}>
          {value}
        </p>
        <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A6E5A', marginTop: 4}}>
          {label}
        </p>
        {sub && <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#9C8E74', marginTop: 2}}>{sub}</p>}
      </div>
    </div>
  );
}
