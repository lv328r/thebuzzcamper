import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticleBySlug } from '../utils/storage';
import CommentSection from '../components/CommentSection';
import { InstallDetailsDisplay } from '../components/InstallDetails';
import { Calendar, Tag, ArrowLeft, Star, CheckCircle, XCircle, ShoppingCart, AlertTriangle, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Stars({ rating }) {
  return (
    <div style={{display: 'flex', gap: 3, alignItems: 'center'}}>
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={20}
          style={{color: n <= rating ? 'var(--color-buzz-orange)' : '#C9BEA0', fill: n <= rating ? 'var(--color-buzz-orange)' : 'none'}} />
      ))}
      <span style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-buzz-navy)', marginLeft: '0.5rem', letterSpacing: '0.04em'}}>
        {rating}/5
      </span>
    </div>
  );
}

const CAT_COLORS = {
  journal:  { accent: 'var(--color-buzz-teal)', label: 'JOURNAL' },
  review:   { accent: 'var(--color-buzz-orange)', label: 'REVIEW' },
  upgrade:  { accent: 'var(--color-buzz-navy)', label: 'BUILD LOG' },
};

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthor } = useAuth();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    getArticleBySlug(slug).then((found) => {
      if (!found) { navigate('/404', { replace: true }); return; }
      setArticle(found);
    }).catch(() => navigate('/404', { replace: true }));
  }, [slug, navigate]);

  function handleCommentUpdate(newComment) {
    setArticle((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
  }

  if (!article) return null;

  const type = article.type || article.category || 'journal';
  const backPath = type === 'upgrade' ? '/upgrades' : `/${type}s`;
  const backLabel = type === 'journal' ? 'Journal' : type === 'review' ? 'Reviews' : 'Build Log';
  const cat = CAT_COLORS[type] || CAT_COLORS.journal;

  return (
    <div style={{background: 'var(--color-buzz-cream)', minHeight: '100vh'}}>
      {/* Page header */}
      <div style={{
        background: cat.accent,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)',
        backgroundSize: '16px 16px',
        borderBottom: '4px solid var(--color-buzz-navy)',
      }}>
        <div style={{maxWidth: 860, margin: '0 auto', padding: '1.75rem 1.5rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Link to={backPath} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
            }}>
              <ArrowLeft size={14} /> BACK TO {backLabel.toUpperCase()}
            </Link>
            {isAuthor && (
              <Link to={`/admin/edit/${slug}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
              }}>
                <Pencil size={13} /> EDIT
              </Link>
            )}
          </div>
        </div>
        <div className="stripe-bar" />
      </div>

      <div style={{maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem'}}>
        {/* Article header */}
        <header style={{marginBottom: '2.5rem'}}>
          {/* Type label */}
          <div style={{display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem', flexWrap: 'wrap'}}>
            <div className="ribbon" style={{
              background: cat.accent,
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
            }}>
              {cat.label}
            </div>
            {article.vendorProvided && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                background: '#FFFBEB', border: '2px solid #F59E0B',
                padding: '0.2rem 0.65rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#92400E',
              }}>
                <AlertTriangle size={10} /> VENDOR SAMPLE
              </div>
            )}
          </div>

          {/* Title — big Bebas Neue */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            color: 'var(--color-buzz-navy)',
            letterSpacing: '0.03em',
            lineHeight: 0.92,
            marginBottom: '1.5rem',
          }}>
            {article.title.toUpperCase()}
          </h1>

          {/* Review product box */}
          {type === 'review' && article.product && (
            <div style={{
              background: '#FBF6E8', border: '2.5px solid var(--color-buzz-navy)',
              boxShadow: '5px 5px 0 var(--color-buzz-orange)',
              padding: '1.5rem', marginBottom: '1.75rem',
              display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start', justifyContent: 'space-between',
            }}>
              <div>
                <span className="retro-label" style={{color: 'var(--color-buzz-teal)', marginBottom: '0.3rem', display: 'block'}}>
                  {article.product.brand}
                </span>
                <p style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '0.03em', color: 'var(--color-buzz-navy)', lineHeight: 0.95, marginBottom: '0.75rem'}}>
                  {article.product.name.toUpperCase()}
                </p>
                {article.rating && <Stars rating={article.rating} />}
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
                {article.product.price && (
                  <span style={{fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.03em', lineHeight: 0.9}}>
                    {article.product.price}
                  </span>
                )}
                {article.product.link && article.product.link !== '#' && (
                  <a href={article.product.link} target="_blank" rel="noopener noreferrer" className="btn-retro" style={{fontSize: '0.9rem', padding: '0.5rem 1.1rem'}}>
                    <ShoppingCart size={14} /> Check Price
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Meta */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center',
            paddingBottom: '1.25rem', borderBottom: '2px dashed rgba(27,58,75,0.25)',
          }}>
            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#7A6E5A', display: 'flex', alignItems: 'center', gap: 4}}>
              <Calendar size={12} /> {article.date}
            </span>
            <span style={{fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)'}}>
              BY {(article.author || '').toUpperCase()}
            </span>
            {(article.tags || []).map((tag) => (
              <span key={tag} style={{display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#7A6E5A'}}>
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Pros / Cons */}
        {type === 'review' && (article.pros?.length > 0 || article.cons?.length > 0) && (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem'}}>
            {article.pros?.length > 0 && (
              <div style={{background: '#F0FDF4', border: '2.5px solid #16A34A', padding: '1.25rem', boxShadow: '4px 4px 0 #16A34A'}}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.04em', color: '#15803D', marginBottom: '0.875rem'}}>
                  <CheckCircle size={16} /> WHAT WORKS
                </h3>
                <ul style={{listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  {article.pros.map((p) => (
                    <li key={p} style={{display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#166534'}}>
                      <span style={{fontWeight: 700, color: '#16A34A', flexShrink: 0}}>+</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {article.cons?.length > 0 && (
              <div style={{background: '#FFF5F5', border: '2.5px solid #DC2626', padding: '1.25rem', boxShadow: '4px 4px 0 #DC2626'}}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.04em', color: '#B91C1C', marginBottom: '0.875rem'}}>
                  <XCircle size={16} /> WHAT DOESN&apos;T
                </h3>
                <ul style={{listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  {article.cons.map((c) => (
                    <li key={c} style={{display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#991B1B'}}>
                      <span style={{fontWeight: 700, color: '#DC2626', flexShrink: 0}}>&minus;</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <article className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* Install details (Build Log only) */}
        {type === 'upgrade' && <InstallDetailsDisplay details={article.installDetails} />}

        {/* Vendor disclosure */}
        {article.vendorProvided && (
          <div style={{
            marginTop: '2rem', background: '#FFFBEB',
            border: '2.5px solid #F59E0B', boxShadow: '4px 4px 0 #F59E0B',
            padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
          }}>
            <AlertTriangle size={16} style={{color: '#B45309', flexShrink: 0, marginTop: 2}} />
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#78350F', lineHeight: 1.65}}>
              <strong>Disclosure:</strong> This product was provided as a review sample at no cost. We retain full editorial control.{' '}
              <Link to="/review-policy" style={{color: 'var(--color-buzz-orange)', textDecoration: 'underline'}}>Read our review policy.</Link>
            </p>
          </div>
        )}

        <CommentSection article={article} onUpdate={handleCommentUpdate} />
      </div>
    </div>
  );
}
