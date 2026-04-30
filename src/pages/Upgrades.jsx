import { useState, useEffect } from 'react';
import { getArticles } from '../utils/storage';
import ArticleCard from '../components/ArticleCard';
import PageHeader from '../components/PageHeader';

const TAGS = ['All', 'solar', 'electrical', 'sleeping', 'storage', 'roof rack', 'kitchen', 'lighting'];

export default function Upgrades() {
  const [all, setAll] = useState([]);
  const [activeTag, setActiveTag] = useState('All');
  useEffect(() => {
    getArticles().then((data) => setAll(data.filter((a) => a.type === 'upgrade'))).catch(() => {});
  }, []);

  const filtered = activeTag === 'All'
    ? all
    : all.filter((a) => (a.tags || []).some((t) => t.toLowerCase().includes(activeTag.toLowerCase())));

  return (
    <div style={{background: 'var(--color-buzz-cream)', minHeight: '100vh'}}>
      <PageHeader
        eyebrow="Living Document — Updated as we build"
        title="BUILD LOG"
        subtitle="Full documentation of every upgrade and modification. Parts lists, install notes, mistakes made, and what we'd do differently."
      />

      <div style={{maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem 5rem'}}>
        {/* Tag filters */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem'}}>
          {TAGS.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              style={{
                padding: '0.4rem 1rem',
                fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'capitalize',
                border: '2.5px solid var(--color-buzz-navy)', cursor: 'pointer', transition: 'all 0.12s',
                background: activeTag === tag ? 'var(--color-buzz-navy)' : '#FBF6E8',
                color: activeTag === tag ? 'white' : 'var(--color-buzz-navy)',
                boxShadow: activeTag === tag ? '3px 3px 0 var(--color-buzz-orange)' : 'none',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{border: '2.5px dashed rgba(27,58,75,0.3)', padding: '3rem', textAlign: 'center', background: '#FBF6E8'}}>
            <p style={{fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em'}}>
              NOTHING TAGGED &ldquo;{activeTag.toUpperCase()}&rdquo; YET
            </p>
            <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#7A6E5A', marginTop: '0.5rem'}}>
              The build is ongoing &mdash; check back soon!
            </p>
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
