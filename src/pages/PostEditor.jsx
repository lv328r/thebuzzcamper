import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveArticle, getArticleBySlug, generateId } from '../utils/storage';
import { Save, Eye } from 'lucide-react';

const CATEGORIES = [
  { value: 'journal', label: 'Journal Entry' },
  { value: 'review', label: 'Gear Review' },
  { value: 'upgrade', label: 'Build Log / Upgrade' },
];

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-buzz-navy text-xs font-bold uppercase tracking-widest mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border-2 border-buzz-navy px-3 py-2 text-sm focus:outline-none focus:border-buzz-orange';

export default function PostEditor() {
  const { user, isAuthor } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEdit = Boolean(slug);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'journal',
    tags: '',
    featured: false,
    vendorProvided: false,
    rating: 0,
    productName: '',
    productBrand: '',
    productPrice: '',
    productLink: '',
    pros: '',
    cons: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthor) {
      navigate('/', { replace: true });
      return;
    }
    if (isEdit && slug) {
      const existing = getArticleBySlug(slug);
      if (existing) {
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
      }
    }
  }, [isAuthor, isEdit, slug, navigate]);

  function set(field) {
    return (e) => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((f) => {
        const updated = { ...f, [field]: val };
        if (field === 'title' && !isEdit) {
          updated.slug = val
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 60);
        }
        return updated;
      });
    };
  }

  function buildArticle() {
    const isReview = form.category === 'review';
    return {
      id: isEdit ? getArticleBySlug(slug)?.id : generateId(),
      type: form.category,
      category: form.category,
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      vendorProvided: form.vendorProvided,
      author: user.username,
      authorId: user.id,
      date: isEdit
        ? getArticleBySlug(slug)?.date || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      comments: isEdit ? getArticleBySlug(slug)?.comments || [] : [],
      coverImage: null,
      ...(isReview
        ? {
            rating: Number(form.rating),
            product: {
              name: form.productName,
              brand: form.productBrand,
              price: form.productPrice,
              link: form.productLink,
            },
            pros: form.pros.split('\n').map((l) => l.trim()).filter(Boolean),
            cons: form.cons.split('\n').map((l) => l.trim()).filter(Boolean),
          }
        : {}),
    };
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      setError('Title, slug, and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const article = buildArticle();
      saveArticle(article);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (!isEdit) {
        const path = form.category === 'upgrade' ? `/upgrades/${form.slug}` : `/${form.category}s/${form.slug}`;
        navigate(path);
      }
    } catch (err) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handlePreview() {
    const article = buildArticle();
    saveArticle(article);
    const path = form.category === 'upgrade' ? `/upgrades/${form.slug}` : `/${form.category}s/${form.slug}`;
    navigate(path);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-buzz-navy font-display text-2xl font-bold">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!form.slug || !form.title}
            className="flex items-center gap-1.5 border-2 border-buzz-navy text-buzz-navy px-4 py-2 text-sm font-bold retro-btn disabled:opacity-40"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-buzz-orange text-white px-4 py-2 text-sm font-bold retro-btn disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Post'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-3 text-sm mb-6">{error}</div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Type */}
        <Field label="Post Type">
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={c.value}
                  checked={form.category === c.value}
                  onChange={set('category')}
                  className="accent-buzz-orange"
                />
                <span className="text-sm text-buzz-navy">{c.label}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Title">
          <input type="text" value={form.title} onChange={set('title')} className={inputCls} placeholder="Post title..." required />
        </Field>

        <Field label="URL Slug">
          <input type="text" value={form.slug} onChange={set('slug')} className={inputCls} placeholder="url-friendly-slug" required />
        </Field>

        <Field label="Excerpt (shown in cards)">
          <textarea value={form.excerpt} onChange={set('excerpt')} rows={2} className={inputCls} placeholder="One or two sentence summary..." />
        </Field>

        <Field label="Content (HTML supported)">
          <textarea
            value={form.content}
            onChange={set('content')}
            rows={18}
            className={`${inputCls} font-mono-retro text-xs leading-relaxed`}
            placeholder="<p>Your content here...</p>&#10;<h2>Section heading</h2>&#10;<p>More content...</p>&#10;<blockquote>A callout or tip</blockquote>"
            required
          />
          <p className="text-xs text-gray-400 mt-1">HTML is rendered directly. Use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt;.</p>
        </Field>

        <Field label="Tags (comma separated)">
          <input type="text" value={form.tags} onChange={set('tags')} className={inputCls} placeholder="solar, 12V, install, review" />
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="accent-buzz-orange w-4 h-4" />
            <span className="text-sm text-buzz-navy font-medium">Featured post</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.vendorProvided} onChange={set('vendorProvided')} className="accent-buzz-orange w-4 h-4" />
            <span className="text-sm text-buzz-navy font-medium">Vendor-provided sample (adds disclosure)</span>
          </label>
        </div>

        {/* Review-specific */}
        {form.category === 'review' && (
          <div className="border-2 border-buzz-orange p-5 space-y-4">
            <h3 className="text-buzz-orange font-bold text-sm uppercase tracking-widest">Review Details</h3>

            <Field label="Star Rating (1–5)">
              <input type="number" min={1} max={5} value={form.rating} onChange={set('rating')} className={`${inputCls} w-24`} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Product Name">
                <input type="text" value={form.productName} onChange={set('productName')} className={inputCls} placeholder="30Qt 12V Fridge" />
              </Field>
              <Field label="Brand">
                <input type="text" value={form.productBrand} onChange={set('productBrand')} className={inputCls} placeholder="BougeRV" />
              </Field>
              <Field label="Price">
                <input type="text" value={form.productPrice} onChange={set('productPrice')} className={inputCls} placeholder="$359" />
              </Field>
              <Field label="Buy Link (optional)">
                <input type="text" value={form.productLink} onChange={set('productLink')} className={inputCls} placeholder="https://..." />
              </Field>
            </div>

            <Field label="Pros (one per line)">
              <textarea value={form.pros} onChange={set('pros')} rows={3} className={inputCls} placeholder="Low power draw&#10;Dual zone&#10;Good warranty" />
            </Field>

            <Field label="Cons (one per line)">
              <textarea value={form.cons} onChange={set('cons')} rows={3} className={inputCls} placeholder="App is buggy&#10;Lid seal shows wear early" />
            </Field>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-buzz-orange text-white px-6 py-2.5 font-bold retro-btn disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={14} /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
