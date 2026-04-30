import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout, { AdminPageHeader } from '../../components/AdminLayout';
import { getArticles, deleteArticle, toggleFeatured, saveArticle } from '../../utils/storage';
import { PenSquare, Trash2, Star, StarOff, Eye, Search, ChevronUp, ChevronDown } from 'lucide-react';

const TYPE_META = {
  journal:  { label: 'Journal',  color: 'var(--color-buzz-teal)' },
  review:   { label: 'Review',   color: 'var(--color-buzz-orange)' },
  upgrade:  { label: 'Build Log',color: 'var(--color-buzz-navy)' },
};

const CATEGORY_OPTIONS = ['All', 'journal', 'review', 'upgrade'];

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  function load() {
    getArticles().then(setArticles).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  function handleToggleFeatured(id) {
    toggleFeatured(id).then(load).catch(() => {});
  }

  function handleDelete(id) {
    deleteArticle(id).then(() => { setDeleteTarget(null); load(); }).catch(() => {});
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const filtered = articles
    .filter((a) => {
      const type = a.type || a.category;
      const matchType = filterType === 'All' || type === filterType;
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.author || '').toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    })
    .sort((a, b) => {
      let valA = sortField === 'date' ? new Date(a.date) : (a[sortField] || '').toString().toLowerCase();
      let valB = sortField === 'date' ? new Date(b.date) : (b[sortField] || '').toString().toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  function SortIcon({ field }) {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  function ColHeader({ field, label }) {
    return (
      <th
        onClick={() => handleSort(field)}
        style={{
          padding: '0.75rem 1rem', textAlign: 'left', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A6E5A',
          userSelect: 'none', background: '#F0EAD6', borderBottom: '2px solid var(--color-buzz-navy)',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: 3}}>
          {label} <SortIcon field={field} />
        </span>
      </th>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="All Posts"
        subtitle={`${articles.length} total posts`}
        action={
          <Link to="/admin/new" className="btn-retro" style={{fontSize: '0.9rem', padding: '0.5rem 1.25rem'}}>
            <PenSquare size={14} /> New Post
          </Link>
        }
      />

      <div style={{padding: '1.5rem 2rem'}}>
        {/* Filters */}
        <div style={{display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <div style={{position: 'relative'}}>
            <Search size={14} style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9C8E74'}} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="field-input"
              style={{paddingLeft: '2.25rem', width: 240}}
            />
          </div>
          <div style={{display: 'flex', gap: '0.4rem'}}>
            {CATEGORY_OPTIONS.map((opt) => (
              <button key={opt} onClick={() => setFilterType(opt)} style={{
                padding: '0.45rem 0.875rem',
                fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.04em',
                border: '2px solid var(--color-buzz-navy)', cursor: 'pointer',
                background: filterType === opt ? 'var(--color-buzz-navy)' : '#FBF6E8',
                color: filterType === opt ? 'white' : 'var(--color-buzz-navy)',
                boxShadow: filterType === opt ? '2px 2px 0 var(--color-buzz-orange)' : 'none',
                transition: 'all 0.12s', textTransform: 'capitalize',
              }}>
                {opt}
              </button>
            ))}
          </div>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#9C8E74', marginLeft: 'auto'}}>
            {filtered.length} of {articles.length}
          </span>
        </div>

        {/* Table */}
        <div style={{border: '2.5px solid var(--color-buzz-navy)', overflow: 'hidden', boxShadow: '5px 5px 0 var(--color-buzz-navy)'}}>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', minWidth: 680}}>
              <thead>
                <tr>
                  <ColHeader field="type" label="Type" />
                  <ColHeader field="title" label="Title" />
                  <ColHeader field="author" label="Author" />
                  <ColHeader field="date" label="Date" />
                  <th style={{padding: '0.75rem 1rem', background: '#F0EAD6', borderBottom: '2px solid var(--color-buzz-navy)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A6E5A', textAlign: 'center'}}>Featured</th>
                  <th style={{padding: '0.75rem 1rem', background: '#F0EAD6', borderBottom: '2px solid var(--color-buzz-navy)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A6E5A', textAlign: 'center'}}>Comments</th>
                  <th style={{padding: '0.75rem 1rem', background: '#F0EAD6', borderBottom: '2px solid var(--color-buzz-navy)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A6E5A'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{padding: '2.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#9C8E74', background: '#FBF6E8'}}>
                      No posts found
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, i) => {
                    const type = a.type || a.category;
                    const meta = TYPE_META[type] || TYPE_META.journal;
                    const linkPath = type === 'upgrade' ? `/upgrades/${a.slug}` : `/${type}s/${a.slug}`;
                    return (
                      <tr key={a.id} style={{background: i % 2 === 0 ? '#FBF6E8' : '#F5EDCC', borderBottom: '1px solid rgba(27,58,75,0.1)'}}>
                        <td style={{padding: '0.75rem 1rem'}}>
                          <span style={{
                            display: 'inline-block',
                            background: meta.color,
                            color: 'white',
                            fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            padding: '0.15rem 0.5rem',
                          }}>
                            {meta.label}
                          </span>
                        </td>
                        <td style={{padding: '0.75rem 1rem', maxWidth: 300}}>
                          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-buzz-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {a.title}
                          </p>
                          {a.vendorProvided && (
                            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#B45309', letterSpacing: '0.06em'}}>VENDOR SAMPLE</span>
                          )}
                        </td>
                        <td style={{padding: '0.75rem 1rem', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A6E5A', whiteSpace: 'nowrap'}}>
                          {a.author}
                        </td>
                        <td style={{padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#7A6E5A', whiteSpace: 'nowrap'}}>
                          {a.date}
                        </td>
                        <td style={{padding: '0.75rem 1rem', textAlign: 'center'}}>
                          <button onClick={() => handleToggleFeatured(a.id)} title={a.featured ? 'Unfeature' : 'Feature'}
                            style={{background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'inline-flex'}}>
                            {a.featured
                              ? <Star size={16} style={{color: 'var(--color-buzz-orange)', fill: 'var(--color-buzz-orange)'}} />
                              : <StarOff size={16} style={{color: '#C9BEA0'}} />
                            }
                          </button>
                        </td>
                        <td style={{padding: '0.75rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#7A6E5A'}}>
                          {(a.comments || []).length}
                        </td>
                        <td style={{padding: '0.75rem 1rem'}}>
                          <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                            <Link to={linkPath} title="View" style={{display: 'inline-flex', padding: '0.35rem', border: '1.5px solid #C9BEA0', color: '#7A6E5A', background: 'transparent'}}>
                              <Eye size={13} />
                            </Link>
                            <Link to={`/admin/edit/${a.slug}`} title="Edit" style={{display: 'inline-flex', padding: '0.35rem', border: '1.5px solid var(--color-buzz-teal)', color: 'var(--color-buzz-teal)', background: 'transparent'}}>
                              <PenSquare size={13} />
                            </Link>
                            <button onClick={() => setDeleteTarget(a)} title="Delete" style={{display: 'inline-flex', padding: '0.35rem', border: '1.5px solid #DC2626', color: '#DC2626', background: 'transparent', cursor: 'pointer'}}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(27,58,75,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '1rem',
        }}>
          <div style={{
            background: '#FBF6E8', border: '3px solid var(--color-buzz-navy)',
            boxShadow: '6px 6px 0 var(--color-buzz-red)',
            padding: '2rem', maxWidth: 440, width: '100%',
          }}>
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem'}}>
              DELETE POST?
            </h2>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A6E5A', marginBottom: '0.5rem'}}>
              This will permanently delete:
            </p>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-buzz-navy)', background: '#F0EAD6', padding: '0.6rem 0.875rem', border: '1.5px solid #C9BEA0', marginBottom: '1.5rem'}}>
              {deleteTarget.title}
            </p>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.825rem', color: '#9C8E74', marginBottom: '1.5rem'}}>
              This action cannot be undone. All comments on this post will also be deleted.
            </p>
            <div style={{display: 'flex', gap: '0.875rem'}}>
              <button onClick={() => handleDelete(deleteTarget.id)} style={{
                flex: 1, padding: '0.7rem 1rem',
                fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em',
                background: '#DC2626', color: 'white', border: '2.5px solid #991B1B',
                boxShadow: '3px 3px 0 #991B1B', cursor: 'pointer',
              }}>
                DELETE
              </button>
              <button onClick={() => setDeleteTarget(null)} style={{
                flex: 1, padding: '0.7rem 1rem',
                fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em',
                background: '#FBF6E8', color: 'var(--color-buzz-navy)', border: '2.5px solid var(--color-buzz-navy)',
                boxShadow: '3px 3px 0 var(--color-buzz-navy)', cursor: 'pointer',
              }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
