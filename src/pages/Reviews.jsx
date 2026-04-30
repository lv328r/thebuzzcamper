import { useState, useEffect } from 'react';
import { getArticles } from '../utils/storage';
import ArticleCard from '../components/ArticleCard';
import PageHeader from '../components/PageHeader';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const RATING_FILTERS = [
  { label: 'All', value: 0 },
  { label: '5 Stars', value: 5 },
  { label: '4+', value: 4 },
  { label: '3+', value: 3 },
];

export default function Reviews() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  useEffect(() => {
    getArticles().then((data) => setAll(data.filter((a) => a.type === 'review'))).catch(() => {});
  }, []);

  const filtered = all.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.product?.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (minRating === 0 || (a.rating || 0) >= minRating);
  });

  return (
    <div style={{background: 'var(--color-buzz-cream)', minHeight: '100vh'}}>
      <PageHeader
        eyebrow="Independent & Honest"
        title="GEAR REVIEWS"
        subtitle="Every review is independently purchased and tested in real conditions — Arizona desert heat, cold nights, dusty trails. If it doesn't work, you'll know."
        accentColor="var(--color-buzz-orange)"
      />

      <div style={{maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem 5rem'}}>
        {/* Disclosure */}
        <div style={{
          background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)',
          borderLeft: '5px solid var(--color-buzz-teal)',
          padding: '1rem 1.25rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        }}>
          <span style={{fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-buzz-teal)', letterSpacing: '0.04em', flexShrink: 0, marginTop: 1}}>NOTE</span>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-buzz-navy)', lineHeight: 1.65}}>
            Unless marked &ldquo;Vendor Sample,&rdquo; all products are purchased with our own money. We retain full editorial control and publish negative findings.{' '}
            <Link to="/review-policy" style={{color: 'var(--color-buzz-orange)', textDecoration: 'underline', fontWeight: 600}}>Read our full review policy.</Link>
          </p>
        </div>

        {/* Filters */}
        <div style={{display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <div style={{position: 'relative'}}>
            <Search size={14} style={{position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-buzz-navy)', opacity: 0.4}} />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews, brands..."
              className="field-input"
              style={{paddingLeft: '2.5rem', width: 280}}
            />
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            {RATING_FILTERS.map((f) => (
              <button key={f.value} onClick={() => setMinRating(f.value)}
                className={minRating === f.value ? 'btn-retro' : ''}
                style={{
                  padding: '0.5rem 0.875rem',
                  fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em',
                  border: '2.5px solid var(--color-buzz-navy)', cursor: 'pointer', transition: 'all 0.12s',
                  background: minRating === f.value ? 'var(--color-buzz-orange)' : '#FBF6E8',
                  color: minRating === f.value ? 'white' : 'var(--color-buzz-navy)',
                  boxShadow: minRating === f.value ? '3px 3px 0 var(--color-buzz-navy)' : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{border: '2.5px dashed rgba(27,58,75,0.3)', padding: '3rem', textAlign: 'center', background: '#FBF6E8'}}>
            <p style={{fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em'}}>NO REVIEWS FOUND</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
            {filtered.map((a) => <ArticleCard key={a.id} article={a} featured />)}
          </div>
        )}
      </div>
    </div>
  );
}
