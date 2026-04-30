import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout, { AdminPageHeader } from '../../components/AdminLayout';
import { getArticles, deleteArticle, saveArticle } from '../../utils/storage';
import { CalendarClock, PenSquare, Trash2, Rocket, Clock } from 'lucide-react';

const TYPE_META = {
  journal:  { label: 'Journal',  color: 'var(--color-buzz-teal)' },
  review:   { label: 'Review',   color: 'var(--color-buzz-orange)' },
  upgrade:  { label: 'Build Log',color: 'var(--color-buzz-navy)' },
};

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeUntil(iso) {
  if (!iso) return '';
  const diff = new Date(iso) - new Date();
  if (diff <= 0) return 'Due now';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function AdminScheduled() {
  const [articles, setArticles] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  function load() {
    getArticles({ adminMode: true }).then((all) => {
      setArticles(all.filter((a) => a.status === 'scheduled' || a.status === 'draft'));
    }).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  const scheduled = articles.filter((a) => a.status === 'scheduled').sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  const drafts = articles.filter((a) => a.status === 'draft');

  async function publishNow(article) {
    setBusy(true);
    try {
      await saveArticle({ ...article, status: 'published', scheduledFor: null });
      load();
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await deleteArticle(toDelete.id);
      setToDelete(null);
      load();
    } finally {
      setBusy(false);
    }
  }

  function ArticleRow({ article }) {
    const meta = TYPE_META[article.type || article.category] || TYPE_META.journal;
    const isOverdue = article.status === 'scheduled' && article.scheduledFor && new Date(article.scheduledFor) <= new Date();
    return (
      <div style={{
        padding: '1rem 1.25rem', borderBottom: '1.5px dashed rgba(27,58,75,0.15)',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ width: 8, height: 8, background: meta.color, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-buzz-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {article.title}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 2, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: meta.color, letterSpacing: '0.06em', fontWeight: 700 }}>
              {meta.label}
            </span>
            {article.status === 'scheduled' && article.scheduledFor && (
              <>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#7A6E5A', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={10} /> {formatDateTime(article.scheduledFor)}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', color: isOverdue ? '#DC2626' : '#7C3AED' }}>
                  {isOverdue ? 'OVERDUE — WILL PUBLISH ON NEXT LOAD' : timeUntil(article.scheduledFor)}
                </span>
              </>
            )}
            {article.status === 'draft' && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.06em' }}>DRAFT</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button onClick={() => publishNow(article)} disabled={busy}
            title="Publish now"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.625rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', border: '1.5px solid #16A34A', color: '#16A34A', background: 'transparent', cursor: 'pointer' }}>
            <Rocket size={11} /> PUBLISH
          </button>
          <Link to={`/admin/edit/${article.slug}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.625rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', border: '1.5px solid var(--color-buzz-teal)', color: 'var(--color-buzz-teal)', textDecoration: 'none' }}>
            <PenSquare size={11} /> EDIT
          </Link>
          <button onClick={() => setToDelete(article)}
            style={{ display: 'flex', padding: '0.35rem', border: '1.5px solid #DC2626', color: '#DC2626', background: 'transparent', cursor: 'pointer' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    );
  }

  function EmptyState({ label }) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#9C8E74', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
        No {label} posts
      </div>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Scheduled & Drafts"
        subtitle="Manage upcoming scheduled posts and saved drafts"
        action={
          <Link to="/admin/new" className="btn-retro" style={{ fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
            <PenSquare size={14} /> New Post
          </Link>
        }
      />

      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Scheduled */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <CalendarClock size={18} color="#7C3AED" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)' }}>
              SCHEDULED ({scheduled.length})
            </h2>
          </div>
          <div style={{ background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)', boxShadow: '4px 4px 0 #7C3AED' }}>
            {scheduled.length === 0 ? <EmptyState label="scheduled" /> : scheduled.map((a) => <ArticleRow key={a.id} article={a} />)}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.04em', marginTop: '0.5rem' }}>
            Scheduled posts go live automatically when a visitor loads the page after the scheduled time.
          </p>
        </div>

        {/* Drafts */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Clock size={18} color="#9C8E74" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)' }}>
              DRAFTS ({drafts.length})
            </h2>
          </div>
          <div style={{ background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)', boxShadow: '4px 4px 0 #9C8E74' }}>
            {drafts.length === 0 ? <EmptyState label="draft" /> : drafts.map((a) => <ArticleRow key={a.id} article={a} />)}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {toDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FBF6E8', border: '3px solid var(--color-buzz-navy)', boxShadow: '6px 6px 0 #DC2626', padding: '2rem', maxWidth: 400, width: '90%' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>DELETE POST?</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#374151', marginBottom: '1.5rem' }}>
              "<strong>{toDelete.title}</strong>" will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={confirmDelete} disabled={busy} style={{ flex: 1, padding: '0.625rem', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', background: '#DC2626', color: 'white', border: '2px solid #991B1B', cursor: 'pointer' }}>
                {busy ? 'DELETING...' : 'DELETE'}
              </button>
              <button onClick={() => setToDelete(null)} style={{ flex: 1, padding: '0.625rem', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', background: 'transparent', color: 'var(--color-buzz-navy)', border: '2px solid var(--color-buzz-navy)', cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
