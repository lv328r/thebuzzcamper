import { useState } from 'react';
import { getArticles } from '../utils/storage';
import ArticleCard from '../components/ArticleCard';
import PageHeader from '../components/PageHeader';
import { Search } from 'lucide-react';

export default function Journal() {
  const all = getArticles().filter((a) => a.category === 'journal' || a.type === 'journal');
  const [search, setSearch] = useState('');

  const filtered = all.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{background: 'var(--color-buzz-cream)', minHeight: '100vh'}}>
      <PageHeader
        eyebrow="Trip Reports & Stories"
        title="JOURNEY JOURNAL"
        subtitle="Real trip reports from the road. What worked, what failed, and what surprised us camping in an EV across the American Southwest."
        accentColor="var(--color-buzz-teal)"
      />

      <div style={{maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem 5rem'}}>
        {/* Search bar */}
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
          <div style={{position: 'relative', maxWidth: 360}}>
            <Search size={15} style={{position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-buzz-navy)', opacity: 0.4}} />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips, places, tags..."
              className="field-input"
              style={{paddingLeft: '2.5rem', width: 360}}
            />
          </div>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#7A6E5A', letterSpacing: '0.06em'}}>
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{border: '2.5px dashed rgba(27,58,75,0.3)', padding: '3rem', textAlign: 'center', background: '#FBF6E8'}}>
            <p style={{fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em'}}>
              NO ENTRIES FOUND
            </p>
            <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.9rem', color: '#7A6E5A', marginTop: '0.5rem'}}>
              {search ? `No results for "${search}"` : 'Check back soon — the trail is ongoing!'}
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
