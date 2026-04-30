import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout, { AdminPageHeader } from '../../components/AdminLayout';
import { getAllComments, deleteComment } from '../../utils/storage';
import { Trash2, ExternalLink, Search, MessageSquare } from 'lucide-react';

const TYPE_META = {
  journal:  { color: 'var(--color-buzz-teal)' },
  review:   { color: 'var(--color-buzz-orange)' },
  upgrade:  { color: 'var(--color-buzz-navy)' },
};

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  function load() { setComments(getAllComments()); }
  useEffect(() => { load(); }, []);

  function handleDelete({ articleId, id }) {
    deleteComment(articleId, id);
    setDeleteTarget(null);
    load();
  }

  const filtered = comments.filter(
    (c) =>
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.userName.toLowerCase().includes(search.toLowerCase()) ||
      c.articleTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Comments"
        subtitle={`${comments.length} total comments across all posts`}
      />

      <div style={{padding: '1.5rem 2rem'}}>
        {/* Search */}
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
          <div style={{position: 'relative'}}>
            <Search size={14} style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9C8E74'}} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comments, users, posts..."
              className="field-input"
              style={{paddingLeft: '2.25rem', width: 320}}
            />
          </div>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#9C8E74', marginLeft: 'auto'}}>
            {filtered.length} of {comments.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            border: '2.5px dashed rgba(27,58,75,0.3)', padding: '3rem', textAlign: 'center', background: '#FBF6E8',
          }}>
            <MessageSquare size={32} style={{color: '#C9BEA0', margin: '0 auto 0.75rem'}} />
            <p style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em'}}>
              NO COMMENTS FOUND
            </p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {filtered.map((c) => {
              const meta = TYPE_META[c.articleType] || TYPE_META.journal;
              const linkPath = c.articleType === 'upgrade'
                ? `/upgrades/${c.articleSlug}`
                : `/${c.articleType}s/${c.articleSlug}`;
              return (
                <div key={c.id} style={{
                  background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)',
                  borderLeft: `5px solid ${meta.color}`,
                  padding: '1rem 1.25rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, background: meta.color, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white',
                  }}>
                    {(c.userName || '?').charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div style={{flex: 1, minWidth: 0}}>
                    {/* Header */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem', flexWrap: 'wrap'}}>
                      <span style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-buzz-navy)'}}>
                        {c.userName}
                      </span>
                      <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.04em'}}>
                        {c.date}
                      </span>
                      <span style={{fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A6E5A'}}>
                        on
                      </span>
                      <Link to={linkPath} style={{fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 600, color: meta.color, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3}}>
                        {c.articleTitle} <ExternalLink size={10} />
                      </Link>
                    </div>

                    {/* Comment body */}
                    <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#374151', lineHeight: 1.65}}>
                      {c.content}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(c)}
                    title="Delete comment"
                    style={{
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, border: '1.5px solid #DC2626', color: '#DC2626',
                      background: 'transparent', cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(27,58,75,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'}}>
          <div style={{background: '#FBF6E8', border: '3px solid var(--color-buzz-navy)', boxShadow: '6px 6px 0 var(--color-buzz-red)', padding: '2rem', maxWidth: 420, width: '100%'}}>
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem'}}>DELETE COMMENT?</h2>
            <div style={{background: '#F0EAD6', border: '1.5px solid #C9BEA0', padding: '0.75rem', marginBottom: '1.25rem'}}>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-buzz-navy)', marginBottom: '0.25rem'}}>{deleteTarget.userName}</p>
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A6E5A'}}>{deleteTarget.content}</p>
            </div>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#9C8E74', marginBottom: '1.5rem'}}>This cannot be undone.</p>
            <div style={{display: 'flex', gap: '0.875rem'}}>
              <button onClick={() => handleDelete(deleteTarget)} style={{flex: 1, padding: '0.7rem', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', background: '#DC2626', color: 'white', border: '2.5px solid #991B1B', boxShadow: '3px 3px 0 #991B1B', cursor: 'pointer'}}>
                DELETE
              </button>
              <button onClick={() => setDeleteTarget(null)} style={{flex: 1, padding: '0.7rem', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', background: '#FBF6E8', color: 'var(--color-buzz-navy)', border: '2.5px solid var(--color-buzz-navy)', boxShadow: '3px 3px 0 var(--color-buzz-navy)', cursor: 'pointer'}}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
