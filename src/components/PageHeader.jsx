export default function PageHeader({ eyebrow, title, subtitle, bg = 'var(--color-buzz-navy)', accentColor = 'var(--color-buzz-orange)' }) {
  return (
    <div style={{background: bg, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px', borderBottom: `4px solid ${accentColor}`}}>
      <div style={{maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem 2.75rem'}}>
        <div className="retro-divider" style={{marginBottom: '1rem', maxWidth: 400}}>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,237,204,0.45)', whiteSpace: 'nowrap'}}>
            &#9830; {eyebrow} &#9830;
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
          color: 'white',
          letterSpacing: '0.04em',
          lineHeight: 0.9,
          textShadow: '4px 4px 0 rgba(0,0,0,0.2)',
          marginBottom: subtitle ? '1rem' : 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', color: 'rgba(245,237,204,0.65)', maxWidth: 520, lineHeight: 1.7, marginTop: '0.5rem'}}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="stripe-bar" />
    </div>
  );
}
