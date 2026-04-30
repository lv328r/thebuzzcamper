import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Star, ArrowRight } from 'lucide-react';

const CAT_META = {
  journal:  { label: 'Journal',   color: 'var(--color-buzz-teal)',   bg: 'var(--color-buzz-teal)' },
  review:   { label: 'Review',    color: 'var(--color-buzz-orange)',  bg: 'var(--color-buzz-orange)' },
  upgrade:  { label: 'Build Log', color: 'var(--color-buzz-navy)',    bg: 'var(--color-buzz-navy)' },
  resource: { label: 'Resource',  color: 'var(--color-buzz-red)',     bg: 'var(--color-buzz-red)' },
};

function Stars({ rating }) {
  return (
    <div style={{display: 'flex', gap: 2}}>
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={13}
          style={{color: n <= rating ? 'var(--color-buzz-orange)' : '#C9BEA0', fill: n <= rating ? 'var(--color-buzz-orange)' : 'none'}} />
      ))}
    </div>
  );
}

export default function ArticleCard({ article, featured = false }) {
  const { type, title, slug, excerpt, date, category, rating, comments = [], product } = article;
  const cat = category || type || 'journal';
  const meta = CAT_META[cat] || CAT_META.journal;
  const linkPath = cat === 'upgrade' ? `/upgrades/${slug}` : `/${cat}s/${slug}`;

  if (featured) {
    return (
      <Link to={linkPath} className="retro-card retro-card-orange" style={{display: 'flex', flexDirection: 'column', textDecoration: 'none', overflow: 'hidden'}}>
        {/* Colored header band */}
        <div style={{
          background: meta.bg,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
          padding: '0.875rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.08em',
            color: 'white', textTransform: 'uppercase',
          }}>
            {meta.label}
          </span>
          {rating && <Stars rating={rating} />}
        </div>

        <div style={{padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', background: '#FBF6E8'}}>
          {product && (
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: meta.color, marginBottom: '0.5rem', display: 'block'}}>
              {product.brand}
            </span>
          )}
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.03em',
            color: 'var(--color-buzz-navy)', lineHeight: 1.05, marginBottom: '0.75rem', flex: 'none',
          }}>
            {title.toUpperCase()}
          </h2>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#5a5040', lineHeight: 1.7, flex: 1}}>
            {excerpt}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '1.1rem', paddingTop: '0.875rem',
            borderTop: '1.5px dashed rgba(27,58,75,0.2)',
          }}>
            <div style={{display: 'flex', gap: '0.875rem'}}>
              <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#9C8E74', display: 'flex', alignItems: 'center', gap: 3}}>
                <Calendar size={10} /> {date}
              </span>
              <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#9C8E74', display: 'flex', alignItems: 'center', gap: 3}}>
                <MessageSquare size={10} /> {comments.length}
              </span>
            </div>
            <span style={{fontFamily: 'var(--font-display)', fontSize: '1rem', color: meta.color, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 3}}>
              READ <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  /* List row variant */
  return (
    <Link to={linkPath} style={{
      display: 'flex', gap: 0, textDecoration: 'none',
      borderBottom: '1.5px dashed rgba(27,58,75,0.2)',
      transition: 'background 0.15s',
    }}
    onMouseOver={e => e.currentTarget.style.background = '#F5EDCC'}
    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Left color stripe */}
      <div style={{width: 4, background: meta.bg, flexShrink: 0}} />

      {/* Left category block */}
      <div style={{
        width: 80, flexShrink: 0, background: meta.bg,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem 0.5rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em',
          color: 'white', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.1,
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        }}>
          {meta.label}
        </span>
      </div>

      <div style={{flex: 1, minWidth: 0, padding: '1rem 1.25rem'}}>
        {product && (
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: meta.color, marginBottom: '0.25rem', display: 'block'}}>
            {product.brand}
          </span>
        )}
        <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.35rem'}}>
          <h3 style={{fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.03em', color: 'var(--color-buzz-navy)', lineHeight: 1.05, flex: 1}}>
            {title.toUpperCase()}
          </h3>
          {rating && <Stars rating={rating} />}
        </div>
        <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#7A6E5A', lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '0.5rem'}}>
          {excerpt}
        </p>
        <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', display: 'flex', alignItems: 'center', gap: 4}}>
          <Calendar size={10} /> {date}
          <span style={{marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: 4}}>
            <MessageSquare size={10} /> {comments.length}
          </span>
        </span>
      </div>
    </Link>
  );
}
