import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout, { AdminPageHeader, StatCard } from '../../components/AdminLayout';
import { getSiteStats } from '../../utils/storage';
import {
  FileText, MessageSquare, Users,
  ArrowRight, TrendingUp, PenSquare, CalendarClock, Sparkles,
} from 'lucide-react';

const TYPE_META = {
  journal:  { label: 'Journal',  color: 'var(--color-buzz-teal)' },
  review:   { label: 'Reviews',  color: 'var(--color-buzz-orange)' },
  upgrade:  { label: 'Build Log',color: 'var(--color-buzz-navy)' },
};

function RecentRow({ children }) {
  return (
    <div style={{
      padding: '0.875rem 1.25rem', borderBottom: '1.5px dashed rgba(27,58,75,0.15)',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getSiteStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Site overview and recent activity"
        action={
          <Link to="/admin/new" className="btn-retro" style={{fontSize: '0.9rem', padding: '0.5rem 1.25rem'}}>
            <PenSquare size={14} /> New Post
          </Link>
        }
      />

      <div style={{padding: '2rem'}}>
        {/* Stat cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '1rem', marginBottom: '2.5rem'}}>
          <StatCard label="Total Posts" value={stats.totalArticles} icon={FileText} color="var(--color-buzz-teal)" />
          <StatCard label="Total Comments" value={stats.totalComments} icon={MessageSquare} color="var(--color-buzz-orange)" />
          <StatCard label="Registered Users" value={stats.totalUsers} icon={Users} color="var(--color-buzz-navy)" />
          <StatCard label="Scheduled" value={stats.totalScheduled || 0} icon={CalendarClock} color="#7C3AED" sub="upcoming posts" />
          <StatCard label="Drafts" value={stats.totalDrafts || 0} icon={TrendingUp} color="#9C8E74" sub="in progress" />
        </div>

        {/* Content breakdown */}
        <div style={{marginBottom: '2.5rem'}}>
          <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)', marginBottom: '1rem'}}>
            CONTENT BREAKDOWN
          </h2>
          <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
            {Object.entries(stats.byType).map(([type, count]) => {
              const meta = TYPE_META[type] || { label: type, color: '#6B7280' };
              return (
                <div key={type} style={{
                  background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)',
                  padding: '0.875rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  boxShadow: `3px 3px 0 ${meta.color}`,
                }}>
                  <div style={{width: 10, height: 10, background: meta.color, borderRadius: '50%'}} />
                  <span style={{fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.03em'}}>{count}</span>
                  <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: meta.color}}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}} className="dash-two-col">
          {/* Recent Posts */}
          <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem'}}>
              <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)'}}>
                RECENT POSTS
              </h2>
              <Link to="/admin/articles" style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-buzz-orange)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3}}>
                All Posts <ArrowRight size={11} />
              </Link>
            </div>
            <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)'}}>
              {stats.recentArticles.length === 0 ? (
                <div style={{padding: '1.5rem', textAlign: 'center', color: '#9C8E74', fontFamily: 'var(--font-sans)', fontSize: '0.875rem'}}>No posts yet</div>
              ) : (
                stats.recentArticles.map((a) => {
                  const meta = TYPE_META[a.type || a.category] || TYPE_META.journal;
                  return (
                    <RecentRow key={a.id}>
                      <div style={{width: 6, height: 6, background: meta.color, borderRadius: '50%', flexShrink: 0}} />
                      <div style={{flex: 1, minWidth: 0}}>
                        <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-buzz-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {a.title}
                        </p>
                        <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.06em', marginTop: 2}}>
                          {meta.label} &bull; {a.date}
                        </p>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem', flexShrink: 0}}>
                        <Link to={`/admin/edit/${a.slug}`} style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
                          color: 'var(--color-buzz-teal)', textDecoration: 'none', letterSpacing: '0.06em',
                        }}>
                          EDIT
                        </Link>
                      </div>
                    </RecentRow>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Comments */}
          <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem'}}>
              <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)'}}>
                RECENT COMMENTS
              </h2>
              <Link to="/admin/comments" style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-buzz-orange)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3}}>
                All <ArrowRight size={11} />
              </Link>
            </div>
            <div style={{background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)'}}>
              {stats.recentComments.length === 0 ? (
                <div style={{padding: '1.5rem', textAlign: 'center', color: '#9C8E74', fontFamily: 'var(--font-sans)', fontSize: '0.875rem'}}>No comments yet</div>
              ) : (
                stats.recentComments.map((c) => (
                  <RecentRow key={c.id}>
                    <div style={{
                      width: 30, height: 30, background: 'var(--color-buzz-teal)', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'white',
                    }}>
                      {(c.userName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-buzz-navy)'}}>
                        {c.userName}
                        <span style={{fontWeight: 400, color: '#9C8E74', marginLeft: '0.4rem', fontSize: '0.75rem'}}>on</span>
                        <span style={{fontWeight: 600, color: 'var(--color-buzz-teal)', marginLeft: '0.3rem', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{c.articleTitle}</span>
                      </p>
                      <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A6E5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1}}>
                        {c.content}
                      </p>
                    </div>
                    <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', flexShrink: 0}}>
                      {c.date}
                    </span>
                  </RecentRow>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed rgba(27,58,75,0.2)'}}>
          <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)', marginBottom: '1rem'}}>
            QUICK ACTIONS
          </h2>
          <div style={{display: 'flex', gap: '0.875rem', flexWrap: 'wrap'}}>
            {[
              { to: '/admin/ai-write', label: 'AI Writer', color: 'var(--color-buzz-orange)' },
              { to: '/admin/new?type=journal', label: 'New Journal Entry', color: 'var(--color-buzz-teal)' },
              { to: '/admin/new?type=review', label: 'New Gear Review', color: 'var(--color-buzz-orange)' },
              { to: '/admin/new?type=upgrade', label: 'New Build Log', color: 'var(--color-buzz-navy)' },
              { to: '/admin/scheduled', label: 'Scheduled Posts', color: '#7C3AED' },
              { to: '/admin/users', label: 'Manage Users', color: 'var(--color-buzz-rust)' },
            ].map(({ to, label, color }) => (
              <Link key={to} to={to} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em',
                background: '#FBF6E8', color: 'var(--color-buzz-navy)',
                border: '2.5px solid var(--color-buzz-navy)',
                boxShadow: `3px 3px 0 ${color}`,
                textDecoration: 'none', transition: 'all 0.12s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `5px 5px 0 ${color}`; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `3px 3px 0 ${color}`; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.dash-two-col{grid-template-columns:1fr!important}}`}</style>
    </AdminLayout>
  );
}
