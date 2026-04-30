import { useState, useEffect } from 'react';
import { getArticles } from '../utils/storage';
import ArticleCard from '../components/ArticleCard';
import PageHeader from '../components/PageHeader';
import { Wrench, Package } from 'lucide-react';

const TAGS = ['All', 'solar', 'electrical', 'sleeping', 'storage', 'roof rack', 'kitchen', 'lighting'];

function SectionHeader({ icon: Icon, title, subtitle, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      borderLeft: `5px solid ${color}`, paddingLeft: '1rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{width: 40, height: 40, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Icon size={20} color="white" />
      </div>
      <div>
        <h2 style={{fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)', lineHeight: 1}}>
          {title.toUpperCase()}
        </h2>
        <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#7A6E5A', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3}}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div style={{border: '2.5px dashed rgba(27,58,75,0.25)', padding: '2.5rem', textAlign: 'center', background: '#FBF6E8'}}>
      <p style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', opacity: 0.5}}>
        NO {label} YET
      </p>
      <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#9C8E74', marginTop: '0.4rem', fontSize: '0.875rem'}}>
        The build is ongoing — check back soon!
      </p>
    </div>
  );
}

export default function Upgrades() {
  const [all, setAll] = useState([]);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    getArticles().then((data) => setAll(data.filter((a) => a.type === 'upgrade'))).catch(() => {});
  }, []);

  function filterByTag(articles) {
    if (activeTag === 'All') return articles;
    return articles.filter((a) => (a.tags || []).some((t) => t.toLowerCase().includes(activeTag.toLowerCase())));
  }

  const permanent = filterByTag(all.filter((a) => !a.buildCategory || a.buildCategory === 'permanent'));
  const campingKit = filterByTag(all.filter((a) => a.buildCategory === 'camping-kit'));

  return (
    <div style={{background: 'var(--color-buzz-cream)', minHeight: '100vh'}}>
      <PageHeader
        eyebrow="Living Document — Updated as we build"
        title="BUILD LOG"
        subtitle="What we've bolted on permanently and what comes along for the trip. Real parts lists, install notes, and honest assessments of what works in the field."
      />

      <div style={{maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem 5rem'}}>

        {/* Tag filters */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem', alignItems: 'center'}}>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '0.25rem'}}>Filter:</span>
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

        {/* ===== PERMANENT UPGRADES ===== */}
        <section style={{marginBottom: '4rem'}}>
          <SectionHeader
            icon={Wrench}
            title="Permanent Upgrades"
            subtitle="Bolted in, wired up, and staying put — full installs documented"
            color="var(--color-buzz-navy)"
          />
          <div style={{height: 2, background: 'var(--color-buzz-navy)', marginBottom: '1.75rem', opacity: 0.15}} />
          {permanent.length === 0 ? (
            <EmptyState label="PERMANENT UPGRADES" />
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
              {permanent.map((a) => <ArticleCard key={a.id} article={a} featured />)}
            </div>
          )}
        </section>

        {/* ===== CAMPING KIT ===== */}
        <section>
          {/* Divider stripe */}
          <div style={{
            background: 'var(--color-buzz-teal)',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.08) 8px, rgba(255,255,255,0.08) 16px)',
            height: 6, marginBottom: '2rem',
          }} />
          <SectionHeader
            icon={Package}
            title="Camping Kit"
            subtitle="Easy on, easy off — gear we load up and take back inside"
            color="var(--color-buzz-teal)"
          />
          <div style={{height: 2, background: 'var(--color-buzz-teal)', marginBottom: '1.75rem', opacity: 0.15}} />
          {campingKit.length === 0 ? (
            <EmptyState label="CAMPING KIT ITEMS" />
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
              {campingKit.map((a) => <ArticleCard key={a.id} article={a} featured />)}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
