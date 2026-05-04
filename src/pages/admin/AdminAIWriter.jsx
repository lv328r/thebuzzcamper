import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout, { AdminPageHeader } from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { saveArticle } from '../../utils/storage';
import {
  Sparkles, Plus, Trash2,
  FileEdit, Rocket, AlertCircle, CheckCircle, Clock,
} from 'lucide-react';


const MODELS = [
  { id: 'claude-3-5-haiku-20241022', label: 'Claude Haiku 3.5', sub: 'Fast & cheap — good for drafts' },
  { id: 'claude-3-5-sonnet-20241022', label: 'Claude Sonnet 3.5', sub: 'Balanced — best for most articles' },
  { id: 'claude-opus-4-5', label: 'Claude Opus', sub: 'Most thorough — reviews & long-form' },
];

const SYSTEM_PROMPT = `You are an experienced content writer for "The Buzz Camper" (thebuzzcamper.com) — a family's real-world VW ID. Buzz camping, overlanding, and vehicle upgrade journey based in southern Arizona.

Writing style: authentic, personal, technically knowledgeable, conversational. Write as the owner sharing genuine first-hand experience. Be specific and honest — include what didn't work as well as what did. Avoid marketing fluff and generic phrases.

Return ONLY a raw JSON object with no markdown code fences, no explanation text, no comments — just the JSON. Use these exact fields:

{
  "title": "Clear descriptive article title",
  "slug": "url-friendly-slug-kebab-case-max-70-chars",
  "excerpt": "2-3 sentence SEO summary for card display and meta description",
  "content": "<p>Full HTML article body. Use h2 and h3 for sections, p for paragraphs, ul/ol/li for lists, blockquote for tips or callouts, strong for emphasis. Target 800-1500 words for reviews and build logs, 400-800 for journal entries.</p>",
  "category": "journal OR review OR upgrade",
  "buildCategory": "permanent OR camping-kit",
  "tags": ["array", "of", "relevant", "tags"],
  "rating": 0,
  "productName": "",
  "productBrand": "",
  "productPrice": "",
  "productLink": "",
  "pros": [],
  "cons": [],
  "installDetails": {
    "manufacturerLinks": [{"label": "Product Page", "url": "https://..."}],
    "installVideos": [{"label": "Install Guide", "url": "https://..."}],
    "extrasNeeded": ["List of additional parts/tools needed"],
    "shipTime": "How long shipping took",
    "shipPackaging": "Notes on how it arrived",
    "buzzSpecific": "Specific fitment notes, measurements, quirks for the VW ID. Buzz"
  }
}

Rules:
- buildCategory only matters when category is "upgrade"
- rating is 1-5 for reviews, 0 for all others
- pros and cons are string arrays — only fill for reviews
- installDetails is only for upgrades — fill what you can from provided links/context, leave empty strings for unknowns
- If image URLs are provided, embed them in the content HTML using: <img src="URL" alt="description" style="max-width:100%;height:auto;border-radius:2px;margin:1.5rem 0;" />
- If reference URLs are provided, link to them naturally in the content where relevant`;

function buildUserPrompt({ postType, topic, referenceUrls, imageUrls, extraContext }) {
  let prompt = `Write a ${postType} post for The Buzz Camper about: ${topic}`;
  if (referenceUrls?.filter((u) => u.url).length > 0) {
    prompt += `\n\nReference URLs (link to these where relevant):\n${referenceUrls.filter((u) => u.url).map((u) => `- ${u.url}${u.label ? ` (${u.label})` : ''}`).join('\n')}`;
  }
  if (imageUrls?.filter((u) => u.url).length > 0) {
    prompt += `\n\nImages to embed in the article content:\n${imageUrls.filter((u) => u.url).map((u) => `- ${u.url}${u.label ? ` (caption: ${u.label})` : ''}`).join('\n')}`;
  }
  if (extraContext?.trim()) {
    prompt += `\n\nAdditional context and notes:\n${extraContext}`;
  }
  return prompt;
}

function UrlListEditor({ items, onChange, urlPlaceholder = 'https://', labelPlaceholder = 'Label (optional)' }) {
  function updateItem(i, field, val) {
    onChange(items.map((x, idx) => (idx === i ? { ...x, [field]: val } : x)));
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '0.4rem', alignItems: 'center' }}>
          <input type="text" value={item.label} placeholder={labelPlaceholder}
            onChange={(e) => updateItem(i, 'label', e.target.value)}
            className="field-input" style={{ fontSize: '0.8rem' }} />
          <input type="url" value={item.url} placeholder={urlPlaceholder}
            onChange={(e) => updateItem(i, 'url', e.target.value)}
            className="field-input" style={{ fontSize: '0.8rem' }} />
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            style={{ display: 'flex', padding: '0.35rem', border: '1.5px solid #DC2626', color: '#DC2626', background: 'transparent', cursor: 'pointer' }}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { label: '', url: '' }])}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem', alignSelf: 'flex-start',
          padding: '0.35rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
          fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          border: '1.5px solid var(--color-buzz-teal)', color: 'var(--color-buzz-teal)',
          background: 'transparent', cursor: 'pointer',
        }}>
        <Plus size={11} /> Add
      </button>
    </div>
  );
}

function Panel({ title, color = 'var(--color-buzz-orange)', children }) {
  return (
    <div style={{ border: '2.5px solid var(--color-buzz-navy)', boxShadow: `4px 4px 0 ${color}`, background: '#FBF6E8', overflow: 'hidden', marginBottom: '1.25rem' }}>
      <div style={{
        background: 'var(--color-buzz-navy)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)',
        backgroundSize: '12px 12px',
        padding: '0.625rem 1.25rem',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', color }}>{title.toUpperCase()}</span>
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.4rem' }}>
      {children}
    </label>
  );
}

export default function AdminAIWriter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [model, setModel] = useState(MODELS[1].id);

  const [postType, setPostType] = useState('upgrade');
  const [topic, setTopic] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [referenceUrls, setReferenceUrls] = useState([{ label: '', url: '' }]);
  const [imageUrls, setImageUrls] = useState([{ label: '', url: '' }]);

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(null);

  const [publishing, setPublishing] = useState(false);
  const [publishDone, setPublishDone] = useState(false);

  const generate = useCallback(async () => {
    if (!topic.trim()) { setError('Describe what you want to write about.'); return; }

    setError('');
    setGenerating(true);
    setGenerated(null);
    setProgress('Connecting to Claude...');

    const userPrompt = buildUserPrompt({ postType, topic, referenceUrls, imageUrls, extraContext });

    try {
      setProgress('Generating article — this takes 15-30 seconds...');
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const raw = data.content?.[0]?.text || '';

      setProgress('Parsing response...');
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Claude did not return valid JSON. Try again.');
      const parsed = JSON.parse(jsonMatch[0]);
      setGenerated(parsed);
      setProgress('');
    } catch (err) {
      setError(err.message || 'Generation failed. Check your API key and try again.');
      setProgress('');
    } finally {
      setGenerating(false);
    }
  }, [model, postType, topic, referenceUrls, imageUrls, extraContext]);

  async function handlePublishNow() {
    if (!generated) return;
    setPublishing(true);
    try {
      await saveArticle({
        ...generated,
        status: 'published',
        author: user.username,
        authorId: user.id,
      });
      setPublishDone(true);
    } catch (err) {
      setError('Publish failed: ' + err.message);
    } finally {
      setPublishing(false);
    }
  }

  function openInEditor() {
    navigate('/admin/new', { state: { prefill: generated } });
  }

  const POST_TYPES = [
    { value: 'journal', label: 'Journal Entry', color: 'var(--color-buzz-teal)' },
    { value: 'review',  label: 'Gear Review',   color: 'var(--color-buzz-orange)' },
    { value: 'upgrade', label: 'Build Log',      color: 'var(--color-buzz-navy)' },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="AI Writer"
        subtitle="Describe what you want — Claude writes the full article"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--color-buzz-orange)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#7A6E5A', letterSpacing: '0.06em' }}>
              POWERED BY ANTHROPIC
            </span>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', padding: '1.5rem 2rem' }} className="ai-grid">

        {/* LEFT — Brief form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* API Key — server-side only */}
          <Panel title="Anthropic API Key" color="var(--color-buzz-navy)">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
              <CheckCircle size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: '#16A34A', marginBottom: '0.3rem' }}>
                  KEY STORED SERVER-SIDE
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#7A6E5A', lineHeight: 1.6 }}>
                  Your Anthropic key is stored as a server-only environment variable in Vercel — it never appears in the browser or JavaScript bundle. To update it, go to your{' '}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--color-buzz-teal)', textDecoration: 'underline' }}>
                    Vercel project settings
                  </a>
                  {' '}→ Environment Variables →{' '}
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: '#F0EAD6', padding: '0.1rem 0.35rem' }}>ANTHROPIC_KEY</code>.
                </p>
              </div>
            </div>
          </Panel>

          {/* Article Brief */}
          <Panel title="Article Brief" color="var(--color-buzz-orange)">
            <div>
              <FieldLabel>What are you writing about? *</FieldLabel>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                className="field-input"
                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}
                placeholder="e.g. Installing a BougeRV 30Qt fridge under the rear seat of the ID. Buzz. We ran it from the 12V socket. Wanted to cover the unboxing, install process, first camping trip use, and how it holds up in Arizona summer heat."
              />
            </div>
            <div>
              <FieldLabel>Additional Context &amp; Notes</FieldLabel>
              <textarea
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                rows={3}
                className="field-input"
                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}
                placeholder="Any extra details: specific dates, locations, how long you've used it, price paid, specific model numbers, your experience level, etc."
              />
            </div>
          </Panel>

          {/* Reference Links */}
          <Panel title="Reference Links" color="var(--color-buzz-teal)">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
              Product pages, manufacturer specs, Amazon listings, forum posts — Claude will link to these in the article
            </p>
            <UrlListEditor
              items={referenceUrls}
              onChange={setReferenceUrls}
              urlPlaceholder="https://amazon.com/product..."
              labelPlaceholder="Label (e.g. Amazon)"
            />
          </Panel>

          {/* Images */}
          <Panel title="Images to Embed" color="var(--color-buzz-rust)">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
              Paste direct image URLs — Claude will embed them in the article at the right places
            </p>
            <UrlListEditor
              items={imageUrls}
              onChange={setImageUrls}
              urlPlaceholder="https://example.com/image.jpg"
              labelPlaceholder="Caption (optional)"
            />
          </Panel>

          {error && (
            <div style={{ background: '#FEF2F2', border: '2px solid #DC2626', boxShadow: '3px 3px 0 #DC2626', padding: '0.875rem 1.25rem', display: 'flex', gap: '0.625rem' }}>
              <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#991B1B' }}>{error}</p>
            </div>
          )}

          {/* Generated preview */}
          {generated && (
            <div style={{ border: '2.5px solid var(--color-buzz-navy)', boxShadow: '4px 4px 0 #16A34A', background: '#F0FDF4', overflow: 'hidden' }}>
              <div style={{ background: '#16A34A', padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={14} color="white" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', color: 'white' }}>ARTICLE GENERATED</span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.03em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                  {generated.title}
                </p>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#374151', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '0.875rem' }}>
                  {generated.excerpt}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {(generated.tags || []).map((t) => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#FBF6E8', border: '1.5px solid #C9BEA0', padding: '0.2rem 0.5rem', color: '#7A6E5A' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {publishDone ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', color: '#16A34A' }}>
                      <CheckCircle size={16} /> PUBLISHED LIVE
                    </div>
                  ) : (
                    <>
                      <button onClick={openInEditor} className="btn-retro" style={{ fontSize: '0.9rem', padding: '0.5rem 1.1rem' }}>
                        <FileEdit size={14} /> Open in Editor
                      </button>
                      <button onClick={handlePublishNow} disabled={publishing} className="btn-retro btn-retro-teal" style={{ fontSize: '0.9rem', padding: '0.5rem 1.1rem', opacity: publishing ? 0.6 : 1 }}>
                        <Rocket size={14} /> {publishing ? 'Publishing...' : 'Publish Now'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Model + Generate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Post type */}
          <Panel title="Post Type">
            {POST_TYPES.map((t) => (
              <label key={t.value} style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer',
                padding: '0.6rem 0.875rem',
                border: `2px solid ${postType === t.value ? t.color : '#C9BEA0'}`,
                background: postType === t.value ? `${t.color}18` : 'transparent',
                transition: 'all 0.12s',
              }}>
                <input type="radio" name="postType" value={t.value}
                  checked={postType === t.value}
                  onChange={(e) => setPostType(e.target.value)}
                  style={{ accentColor: t.color }} />
                <div style={{ width: 8, height: 8, background: t.color, borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)' }}>
                  {t.label.toUpperCase()}
                </span>
              </label>
            ))}
          </Panel>

          {/* Model */}
          <Panel title="Claude Model" color="var(--color-buzz-teal)">
            {MODELS.map((m) => (
              <label key={m.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer',
                padding: '0.6rem 0.875rem',
                border: `2px solid ${model === m.id ? 'var(--color-buzz-teal)' : '#C9BEA0'}`,
                background: model === m.id ? 'rgba(14,116,144,0.08)' : 'transparent',
                transition: 'all 0.12s',
              }}>
                <input type="radio" name="model" value={m.id}
                  checked={model === m.id}
                  onChange={(e) => setModel(e.target.value)}
                  style={{ accentColor: 'var(--color-buzz-teal)', marginTop: 3 }} />
                <div>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.04em', color: 'var(--color-buzz-navy)' }}>
                    {m.label.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#7A6E5A' }}>{m.sub}</span>
                </div>
              </label>
            ))}
          </Panel>

          {/* Tips */}
          <div style={{ border: '2px dashed rgba(27,58,75,0.2)', padding: '1rem', background: 'rgba(255,255,255,0.4)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', color: 'var(--color-buzz-navy)', marginBottom: '0.625rem' }}>TIPS FOR BEST RESULTS</p>
            {[
              'Be specific about the product model and what you did with it',
              'Mention how long you\'ve used it and any problems encountered',
              'Add the manufacturer link so Claude can fill install details accurately',
              'Add your own photo URLs so they\'re embedded in the article',
              'Use "Open in Editor" to review and tweak before publishing',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--color-buzz-orange)', fontWeight: 700, flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A6E5A', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={generating || !topic}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
              width: '100%', padding: '1rem',
              fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.06em',
              background: generating ? '#9C8E74' : 'var(--color-buzz-navy)',
              backgroundImage: generating ? 'none' : 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)',
              backgroundSize: '14px 14px',
              color: 'var(--color-buzz-orange)',
              border: '2.5px solid var(--color-buzz-navy)',
              boxShadow: generating ? 'none' : '5px 5px 0 var(--color-buzz-orange)',
              cursor: generating || !topic ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              transform: generating ? 'translate(3px,3px)' : '',
            }}>
            <Sparkles size={20} />
            {generating ? 'GENERATING...' : 'GENERATE ARTICLE'}
          </button>

          {progress && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', background: '#FBF6E8', border: '1.5px solid #C9BEA0' }}>
              <Clock size={13} color="var(--color-buzz-orange)" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#7A6E5A', letterSpacing: '0.04em' }}>{progress}</span>
            </div>
          )}

          {generated && !publishDone && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <button onClick={openInEditor} className="btn-retro" style={{ width: '100%', justifyContent: 'center' }}>
                <FileEdit size={14} /> Open in Editor
              </button>
              <button onClick={handlePublishNow} disabled={publishing} className="btn-retro btn-retro-teal" style={{ width: '100%', justifyContent: 'center', opacity: publishing ? 0.6 : 1 }}>
                <Rocket size={14} /> {publishing ? 'Publishing...' : 'Publish Now'}
              </button>
              <button onClick={generate} disabled={generating} style={{
                width: '100%', padding: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                border: '1.5px solid #9C8E74', color: '#9C8E74', background: 'transparent', cursor: 'pointer',
              }}>
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`@media(max-width:900px){.ai-grid{grid-template-columns:1fr!important}}`}</style>
    </AdminLayout>
  );
}
