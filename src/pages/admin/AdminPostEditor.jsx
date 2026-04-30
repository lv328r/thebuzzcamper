import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout, { AdminPageHeader } from '../../components/AdminLayout';
import RichEditor from '../../components/RichEditor';
import { saveArticle, getArticleBySlug, generateId } from '../../utils/storage';
import { Save, ArrowLeft, Star } from 'lucide-react';

const CATEGORIES = [
  { value: 'journal', label: 'Journal Entry', color: 'var(--color-buzz-teal)' },
  { value: 'review',  label: 'Gear Review',   color: 'var(--color-buzz-orange)' },
  { value: 'upgrade', label: 'Build Log',      color: 'var(--color-buzz-navy)' },
];

function FieldLabel({ children }) {
  return (
    <label style={{display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.4rem'}}>
      {children}
    </label>
  );
}

function Section({ title, children, color = 'var(--color-buzz-orange)' }) {
  return (
    <div style={{border: '2.5px solid var(--color-buzz-navy)', boxShadow: `4px 4px 0 ${color}`, background: '#FBF6E8', overflow: 'hidden'}}>
      <div style={{
        background: 'var(--color-buzz-navy)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)',
        backgroundSize: '12px 12px',
        padding: '0.625rem 1.25rem',
      }}>
        <span style={{fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', color: color}}>{title.toUpperCase()}</span>
      </div>
      <div style={{padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem'}}>
        {children}
      </div>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{display: 'flex', gap: 4}}>
      {[1,2,3,4,5].map((n) => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{background: 'none', border: 'none', cursor: 'pointer', padding: 2}}>
          <Star size={24}
            style={{
              color: n <= (hovered || value) ? 'var(--color-buzz-orange)' : '#C9BEA0',
              fill: n <= (hovered || value) ? 'var(--color-buzz-orange)' : 'none',
              transition: 'all 0.1s',
            }}
          />
        </button>
      ))}
      {value > 0 && (
        <span style={{fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-buzz-orange)', marginLeft: '0.5rem', alignSelf: 'center'}}>
          {value}/5
        </span>
      )}
    </div>
  );
}

export default function AdminPostEditor() {
  const { user, isAuthor } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(slug);
  const presetType = searchParams.get('type') || 'journal';

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: presetType,
    tags: '', featured: false, vendorProvided: false,
    rating: 0, productName: '', productBrand: '', productPrice: '', productLink: '',
    pros: '', cons: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false); // kept for cover image preview only

  useEffect(() => {
    if (!isAuthor) { navigate('/', { replace: true }); return; }
    if (isEdit && slug) {
      getArticleBySlug(slug).then((existing) => {
        if (!existing) return;
        setForm({
          title: existing.title || '',
          slug: existing.slug || '',
          excerpt: existing.excerpt || '',
          content: existing.content || '',
          category: existing.category || existing.type || 'journal',
          tags: (existing.tags || []).join(', '),
          featured: existing.featured || false,
          vendorProvided: existing.vendorProvided || false,
          rating: existing.rating || 0,
          productName: existing.product?.name || '',
          productBrand: existing.product?.brand || '',
          productPrice: existing.product?.price || '',
          productLink: existing.product?.link || '',
          pros: (existing.pros || []).join('\n'),
          cons: (existing.cons || []).join('\n'),
        });
      });
    }
  }, [isAuthor, isEdit, slug, navigate]);

  function set(field) {
    return (e) => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((f) => {
        const updated = { ...f, [field]: val };
        if (field === 'title' && !isEdit) {
          updated.slug = val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 70);
        }
        return updated;
      });
    };
  }

  function buildArticle() {
    const isReview = form.category === 'review';
    return {
      slug: form.slug,
      type: form.category,
      category: form.category,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      vendorProvided: form.vendorProvided,
      author: user.username,
      authorId: user.id,
      ...(isReview ? {
        rating: Number(form.rating),
        product: {
          name: form.productName,
          brand: form.productBrand,
          price: form.productPrice,
          link: form.productLink,
        },
        pros: form.pros.split('\n').map((l) => l.trim()).filter(Boolean),
        cons: form.cons.split('\n').map((l) => l.trim()).filter(Boolean),
      } : {}),
    };
  }

  async function handleSave(andNavigate = false) {
    if (!form.title || !form.slug || !form.content) {
      setError('Title, slug, and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const article = buildArticle();
      await saveArticle(article);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (andNavigate) {
        const path = form.category === 'upgrade' ? `/upgrades/${form.slug}` : `/${form.category}s/${form.slug}`;
        navigate(path);
      }
    } catch (err) {
      setError('Save failed: ' + (err.message || 'Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={isEdit ? 'Edit Post' : 'New Post'}
        subtitle={isEdit ? `Editing: ${form.title || slug}` : 'Create a new article, review, or build log entry'}
        action={
          <div style={{display: 'flex', gap: '0.625rem', alignItems: 'center'}}>
            <Link to="/admin/articles" style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#7A6E5A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3}}>
              <ArrowLeft size={12} /> All Posts
            </Link>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="btn-retro"
              style={{fontSize: '0.9rem', padding: '0.5rem 1.25rem', opacity: saving ? 0.6 : 1}}
            >
              <Save size={14} />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="btn-retro btn-retro-teal"
              style={{fontSize: '0.9rem', padding: '0.5rem 1.25rem', opacity: saving ? 0.6 : 1}}
            >
              Save &amp; View
            </button>
          </div>
        }
      />

      {error && (
        <div style={{background: '#FEF2F2', border: '2px solid #DC2626', padding: '0.875rem 1.5rem', margin: '0 2rem', marginTop: '1.25rem'}}>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#DC2626'}}>{error}</p>
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', padding: '1.5rem 2rem'}} className="editor-grid">

        {/* MAIN EDITOR / PREVIEW */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0}}>

          <>
              <Section title="Core Details">
                <div>
                  <FieldLabel>Title *</FieldLabel>
                  <input type="text" value={form.title} onChange={set('title')} className="field-input" placeholder="Write a clear, descriptive title..." />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <FieldLabel>URL Slug *</FieldLabel>
                    <input type="text" value={form.slug} onChange={set('slug')} className="field-input" placeholder="url-friendly-slug" />
                    <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', marginTop: '0.3rem', letterSpacing: '0.04em'}}>
                      thebuzzcamper.com/{form.category}s/{form.slug || '...'}
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Tags (comma separated)</FieldLabel>
                    <input type="text" value={form.tags} onChange={set('tags')} className="field-input" placeholder="solar, 12V, desert, review" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Excerpt (shown in cards &amp; SEO)</FieldLabel>
                  <textarea value={form.excerpt} onChange={set('excerpt')} rows={2} className="field-input" style={{resize: 'vertical', fontFamily: 'var(--font-sans)'}} placeholder="One or two sentence summary for cards and search engines..." />
                </div>
              </Section>

              <Section title="Content" color="var(--color-buzz-teal)">
                <div>
                  <RichEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                    placeholder="Start writing your post... Use the toolbar above to format text, add headings, insert images, and more."
                  />
                  <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', marginTop: '0.4rem', letterSpacing: '0.04em'}}>
                    Upload images from device or paste an image URL. Images are embedded directly — no hosting required.
                  </p>
                </div>
              </Section>
          </>
        </div>

        {/* SIDEBAR SETTINGS */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          {/* Post Type */}
          <Section title="Post Type">
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {CATEGORIES.map((c) => (
                <label key={c.value} style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer',
                  padding: '0.6rem 0.875rem',
                  border: `2px solid ${form.category === c.value ? c.color : '#C9BEA0'}`,
                  background: form.category === c.value ? `${c.color}15` : 'transparent',
                  transition: 'all 0.12s',
                }}>
                  <input
                    type="radio" name="category" value={c.value}
                    checked={form.category === c.value}
                    onChange={set('category')}
                    style={{accentColor: c.color}}
                  />
                  <div style={{width: 8, height: 8, background: c.color, borderRadius: '50%', flexShrink: 0}} />
                  <span style={{fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)'}}>
                    {c.label.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          {/* Options */}
          <Section title="Options">
            {[
              { field: 'featured', label: 'Featured Post', sub: 'Shown on the home page' },
              { field: 'vendorProvided', label: 'Vendor Sample', sub: 'Adds FTC disclosure banner' },
            ].map(({ field, label, sub }) => (
              <label key={field} style={{display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer'}}>
                <input
                  type="checkbox" checked={form[field]} onChange={set(field)}
                  style={{accentColor: 'var(--color-buzz-orange)', marginTop: 3, width: 16, height: 16}}
                />
                <div>
                  <span style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-buzz-navy)', display: 'block'}}>{label}</span>
                  <span style={{fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#9C8E74'}}>{sub}</span>
                </div>
              </label>
            ))}
          </Section>

          {/* Review-specific */}
          {form.category === 'review' && (
            <Section title="Review Details" color="var(--color-buzz-orange)">
              <div>
                <FieldLabel>Star Rating</FieldLabel>
                <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({...f, rating: v}))} />
              </div>
              <div>
                <FieldLabel>Product Name</FieldLabel>
                <input type="text" value={form.productName} onChange={set('productName')} className="field-input" placeholder="30Qt 12V Fridge" />
              </div>
              <div>
                <FieldLabel>Brand</FieldLabel>
                <input type="text" value={form.productBrand} onChange={set('productBrand')} className="field-input" placeholder="BougeRV" />
              </div>
              <div>
                <FieldLabel>Price</FieldLabel>
                <input type="text" value={form.productPrice} onChange={set('productPrice')} className="field-input" placeholder="$359" />
              </div>
              <div>
                <FieldLabel>Buy Link</FieldLabel>
                <input type="text" value={form.productLink} onChange={set('productLink')} className="field-input" placeholder="https://amazon.com/..." />
              </div>
              <div>
                <FieldLabel>Pros (one per line)</FieldLabel>
                <textarea value={form.pros} onChange={set('pros')} rows={4} className="field-input" style={{resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.85rem'}} placeholder="Low power draw&#10;Dual zone&#10;Good warranty" />
              </div>
              <div>
                <FieldLabel>Cons (one per line)</FieldLabel>
                <textarea value={form.cons} onChange={set('cons')} rows={4} className="field-input" style={{resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.85rem'}} placeholder="App is buggy&#10;Lid seal shows early wear" />
              </div>
            </Section>
          )}

          {/* Publish */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.625rem'}}>
            <button onClick={() => handleSave(false)} disabled={saving} className="btn-retro" style={{width: '100%', justifyContent: 'center', opacity: saving ? 0.6 : 1}}>
              <Save size={14} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Draft'}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="btn-retro btn-retro-teal" style={{width: '100%', justifyContent: 'center', opacity: saving ? 0.6 : 1}}>
              Save &amp; View Live
            </button>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.editor-grid{grid-template-columns:1fr!important}}`}</style>
    </AdminLayout>
  );
}
