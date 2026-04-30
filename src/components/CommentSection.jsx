import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addComment } from '../utils/storage';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function CommentSection({ article, onUpdate }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const comments = article.comments || [];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const saved = await addComment(article.id, {
        userId: user.id,
        userName: user.username,
        content: text.trim(),
      });
      onUpdate(saved);
      setText('');
    } catch {
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #EDE8DC'}}>
      <h3 style={{display: 'flex', alignItems: 'center', gap: '0.625rem', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-buzz-navy)', marginBottom: '1.5rem'}}>
        <MessageSquare size={18} style={{color: 'var(--color-buzz-orange)'}} />
        Comments ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#9CA3AF', fontStyle: 'italic', marginBottom: '1.5rem'}}>
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem'}}>
          {comments.map((c) => (
            <div key={c.id} style={{display: 'flex', gap: '0.875rem', paddingBottom: '1.25rem', borderBottom: '1px solid #F3F0E8'}}>
              <div style={{
                flexShrink: 0, width: 36, height: 36,
                background: 'var(--color-buzz-teal)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'white',
              }}>
                {c.userName ? c.userName.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.625rem', marginBottom: '0.375rem'}}>
                  <span style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-buzz-navy)'}}>{c.userName}</span>
                  <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#9CA3AF', letterSpacing: '0.04em'}}>{c.date}</span>
                </div>
                <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#374151', lineHeight: 1.65}}>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
          <label style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-buzz-navy)'}}>
            Leave a comment
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts, questions, or experience..."
            className="field-input"
            style={{resize: 'none', fontFamily: 'var(--font-sans)'}}
          />
          {error && <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#DC2626'}}>{error}</p>}
          <div>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="btn-primary"
              style={{opacity: (submitting || !text.trim()) ? 0.5 : 1}}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{background: '#F9F5EC', border: '1.5px solid #D1C9B8', padding: '1.25rem 1.5rem'}}>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-buzz-navy)'}}>
            <Link to="/login" style={{color: 'var(--color-buzz-orange)', fontWeight: 700, textDecoration: 'none'}}>Sign in</Link>
            {' '}or{' '}
            <Link to="/register" style={{color: 'var(--color-buzz-orange)', fontWeight: 700, textDecoration: 'none'}}>register</Link>
            {' '}to leave a comment.
          </p>
        </div>
      )}
    </section>
  );
}
