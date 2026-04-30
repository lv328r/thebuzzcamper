import { ExternalLink, Youtube, Package, Clock, Box, Wrench, Info, Plus, Trash2 } from 'lucide-react';

// ─── READ-ONLY DISPLAY (ArticlePage) ─────────────────────────────────────────

function DetailCard({ icon: Icon, title, color = 'var(--color-buzz-navy)', children }) {
  return (
    <div style={{border: '2.5px solid var(--color-buzz-navy)', boxShadow: `4px 4px 0 ${color}`, background: '#FBF6E8', overflow: 'hidden', marginBottom: '1.25rem'}}>
      <div style={{
        background: 'var(--color-buzz-navy)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)',
        backgroundSize: '12px 12px',
        padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <Icon size={14} color={color} />
        <span style={{fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.08em', color}}>{title.toUpperCase()}</span>
      </div>
      <div style={{padding: '1rem 1.25rem'}}>{children}</div>
    </div>
  );
}

function LinkList({ items }) {
  if (!items?.length) return <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#9C8E74', fontStyle: 'italic'}}>None listed</p>;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
      {items.map((item, i) => (
        <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--color-buzz-teal)', textDecoration: 'none',
          padding: '0.4rem 0.625rem', background: '#F0EAD6', border: '1.5px solid #C9BEA0',
          transition: 'border-color 0.12s',
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-buzz-teal)'}
        onMouseOut={e => e.currentTarget.style.borderColor = '#C9BEA0'}
        >
          <ExternalLink size={12} style={{flexShrink: 0}} />
          {item.label || item.url}
        </a>
      ))}
    </div>
  );
}

export function InstallDetailsDisplay({ details }) {
  if (!details) return null;
  const { manufacturerLinks, installVideos, extrasNeeded, shipTime, shipPackaging, buzzSpecific } = details;

  const hasAny = (manufacturerLinks?.length || installVideos?.length || extrasNeeded?.length || shipTime || shipPackaging || buzzSpecific);
  if (!hasAny) return null;

  return (
    <div style={{marginTop: '3rem', paddingTop: '2.5rem', borderTop: '2px dashed rgba(27,58,75,0.2)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem'}}>
        <div style={{width: 6, height: 6, background: 'var(--color-buzz-navy)', borderRadius: '50%'}} />
        <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', lineHeight: 1}}>
          INSTALL DETAILS
        </h2>
        <div style={{flex: 1, height: 2, background: 'rgba(27,58,75,0.15)'}} />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', columnGap: '1.25rem'}} className="install-grid">

        {(manufacturerLinks?.length > 0) && (
          <DetailCard icon={Package} title="Manufacturer Equipment" color="var(--color-buzz-navy)">
            <LinkList items={manufacturerLinks} />
          </DetailCard>
        )}

        {(installVideos?.length > 0) && (
          <DetailCard icon={Youtube} title="Install Videos" color="#DC2626">
            <LinkList items={installVideos} />
          </DetailCard>
        )}

        {(extrasNeeded?.length > 0) && (
          <DetailCard icon={Wrench} title="Extras Needed for Install" color="var(--color-buzz-orange)">
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
              {extrasNeeded.map((item, i) => (
                <li key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#374151'}}>
                  <span style={{color: 'var(--color-buzz-orange)', fontWeight: 700, flexShrink: 0, marginTop: 1}}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </DetailCard>
        )}

        {(shipTime || shipPackaging) && (
          <DetailCard icon={Clock} title="Shipping" color="var(--color-buzz-teal)">
            {shipTime && (
              <div style={{marginBottom: shipPackaging ? '0.75rem' : 0}}>
                <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9C8E74', marginBottom: 3}}>Ship Time</p>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#374151'}}>{shipTime}</p>
              </div>
            )}
            {shipPackaging && (
              <div>
                <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9C8E74', marginBottom: 3}}>Packaging</p>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#374151'}}>{shipPackaging}</p>
              </div>
            )}
          </DetailCard>
        )}

      </div>

      {buzzSpecific && (
        <div style={{
          background: 'var(--color-buzz-navy)',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
          border: '2.5px solid var(--color-buzz-navy)',
          boxShadow: '5px 5px 0 var(--color-buzz-orange)',
          padding: '1.5rem',
          marginTop: '0.25rem',
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem'}}>
            <Info size={16} color="var(--color-buzz-orange)" />
            <span style={{fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.08em', color: 'var(--color-buzz-orange)'}}>ID. BUZZ SPECIFIC NOTES</span>
          </div>
          <div style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, whiteSpace: 'pre-wrap'}}>
            {buzzSpecific}
          </div>
        </div>
      )}

      <style>{`@media(max-width:640px){.install-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}


// ─── EDITOR (AdminPostEditor) ─────────────────────────────────────────────────

function EditorSection({ title, color = 'var(--color-buzz-orange)', children }) {
  return (
    <div style={{border: '2px solid var(--color-buzz-navy)', boxShadow: `3px 3px 0 ${color}`, background: '#FBF6E8', overflow: 'hidden', marginBottom: '1rem'}}>
      <div style={{background: 'var(--color-buzz-navy)', padding: '0.45rem 1rem'}}>
        <span style={{fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.08em', color}}>{title.toUpperCase()}</span>
      </div>
      <div style={{padding: '1rem'}}>{children}</div>
    </div>
  );
}

function LinkEditor({ items = [], onChange, placeholder = 'https://' }) {
  function updateItem(i, field, val) {
    const next = items.map((x, idx) => idx === i ? { ...x, [field]: val } : x);
    onChange(next);
  }
  function addItem() { onChange([...items, { label: '', url: '' }]); }
  function removeItem(i) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
      {items.map((item, i) => (
        <div key={i} style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '0.4rem', alignItems: 'center'}}>
          <input type="text" value={item.label} placeholder="Label"
            onChange={(e) => updateItem(i, 'label', e.target.value)}
            className="field-input" style={{fontSize: '0.82rem'}} />
          <input type="url" value={item.url} placeholder={placeholder}
            onChange={(e) => updateItem(i, 'url', e.target.value)}
            className="field-input" style={{fontSize: '0.82rem'}} />
          <button type="button" onClick={() => removeItem(i)} style={{display: 'flex', padding: '0.35rem', border: '1.5px solid #DC2626', color: '#DC2626', background: 'transparent', cursor: 'pointer'}}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem', alignSelf: 'flex-start',
        padding: '0.35rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
        fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        border: '1.5px solid var(--color-buzz-teal)', color: 'var(--color-buzz-teal)',
        background: 'transparent', cursor: 'pointer',
      }}>
        <Plus size={11} /> Add Link
      </button>
    </div>
  );
}

function ListEditor({ items = [], onChange, placeholder = 'Item...' }) {
  function updateItem(i, val) { onChange(items.map((x, idx) => idx === i ? val : x)); }
  function addItem() { onChange([...items, '']); }
  function removeItem(i) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
      {items.map((item, i) => (
        <div key={i} style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.4rem', alignItems: 'center'}}>
          <input type="text" value={item} placeholder={placeholder}
            onChange={(e) => updateItem(i, e.target.value)}
            className="field-input" style={{fontSize: '0.82rem'}} />
          <button type="button" onClick={() => removeItem(i)} style={{display: 'flex', padding: '0.35rem', border: '1.5px solid #DC2626', color: '#DC2626', background: 'transparent', cursor: 'pointer'}}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem', alignSelf: 'flex-start',
        padding: '0.35rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
        fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        border: '1.5px solid var(--color-buzz-orange)', color: 'var(--color-buzz-orange)',
        background: 'transparent', cursor: 'pointer',
      }}>
        <Plus size={11} /> Add Item
      </button>
    </div>
  );
}

export function InstallDetailsEditor({ value = {}, onChange }) {
  const d = value;
  function update(field, val) { onChange({ ...d, [field]: val }); }

  return (
    <div>
      <EditorSection title="Manufacturer Equipment" color="var(--color-buzz-navy)">
        <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', marginBottom: '0.5rem', letterSpacing: '0.04em'}}>Links to product pages, manuals, spec sheets</p>
        <LinkEditor items={d.manufacturerLinks || []} onChange={(v) => update('manufacturerLinks', v)} placeholder="https://manufacturer.com/product" />
      </EditorSection>

      <EditorSection title="Install Videos" color="#DC2626">
        <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', marginBottom: '0.5rem', letterSpacing: '0.04em'}}>YouTube, Vimeo, or any video walkthrough</p>
        <LinkEditor items={d.installVideos || []} onChange={(v) => update('installVideos', v)} placeholder="https://youtube.com/watch?v=..." />
      </EditorSection>

      <EditorSection title="Extras Needed for Install" color="var(--color-buzz-orange)">
        <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', marginBottom: '0.5rem', letterSpacing: '0.04em'}}>Additional parts, tools, or hardware required</p>
        <ListEditor items={d.extrasNeeded || []} onChange={(v) => update('extrasNeeded', v)} placeholder="e.g. M6 bolts, wire loom, 10A fuse..." />
      </EditorSection>

      <EditorSection title="Shipping" color="var(--color-buzz-teal)">
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.625rem'}}>
          <div>
            <label style={{display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A6E5A', marginBottom: 3}}>
              Ship Time
            </label>
            <input type="text" value={d.shipTime || ''} onChange={(e) => update('shipTime', e.target.value)}
              className="field-input" style={{fontSize: '0.85rem'}} placeholder="e.g. Arrived in 4 days via Amazon Prime" />
          </div>
          <div>
            <label style={{display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A6E5A', marginBottom: 3}}>
              Packaging Notes
            </label>
            <input type="text" value={d.shipPackaging || ''} onChange={(e) => update('shipPackaging', e.target.value)}
              className="field-input" style={{fontSize: '0.85rem'}} placeholder="e.g. Double-boxed, no damage, good foam padding" />
          </div>
        </div>
      </EditorSection>

      <EditorSection title="ID. Buzz Specific Notes" color="var(--color-buzz-orange)">
        <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', marginBottom: '0.5rem', letterSpacing: '0.04em'}}>Fitment quirks, measurements, clearance issues, wiring specifics for the ID. Buzz</p>
        <textarea
          value={d.buzzSpecific || ''}
          onChange={(e) => update('buzzSpecific', e.target.value)}
          rows={5}
          className="field-input"
          style={{resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.85rem'}}
          placeholder="e.g. The 12V aux socket is behind the left rear panel. Cable routing through the existing grommet near the antenna requires an 8mm socket..."
        />
      </EditorSection>
    </div>
  );
}
