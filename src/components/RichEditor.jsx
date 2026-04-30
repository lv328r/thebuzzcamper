import { useEditor, EditorContent } from '@tiptap/react';
import { uploadImage } from '../utils/storage';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useRef, useCallback } from 'react';
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Minus, Link2, Link2Off,
  Image as ImageIcon, Undo, Redo, Code, Type,
} from 'lucide-react';

function ToolbarDivider() {
  return <div style={{width: 1, height: 20, background: 'rgba(27,58,75,0.2)', margin: '0 2px', flexShrink: 0}} />;
}

function ToolBtn({ onClick, active, disabled, title, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 28, border: 'none', cursor: disabled ? 'default' : 'pointer',
        background: active ? 'var(--color-buzz-navy)' : 'transparent',
        color: active ? 'white' : danger ? '#DC2626' : 'var(--color-buzz-navy)',
        opacity: disabled ? 0.35 : 1,
        borderRadius: 2,
        transition: 'all 0.1s',
        flexShrink: 0,
      }}
      onMouseOver={e => { if (!disabled && !active) e.currentTarget.style.background = '#F0EAD6'; }}
      onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, placeholder = 'Start writing...' }) {
  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. when loading an existing post)
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', prev || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleImageFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    e.target.value = '';
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch {
      // Fallback to base64 if storage upload fails
      const reader = new FileReader();
      reader.onload = (ev) => {
        editor.chain().focus().setImage({ src: ev.target.result, alt: file.name }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  const handleImageUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL', 'https://');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const wordCount = editor.storage.characterCount?.words() ?? 0;
  const charCount = editor.storage.characterCount?.characters() ?? 0;

  return (
    <div style={{border: '2px solid var(--color-buzz-navy)', background: '#FDFAF2', overflow: 'hidden'}}>
      {/* ===== TOOLBAR ===== */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, padding: '6px 8px',
        background: '#F0EAD6', borderBottom: '2px solid var(--color-buzz-navy)',
      }}>
        {/* History */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo size={14} />
        </ToolBtn>

        <ToolbarDivider />

        {/* Text format */}
        <ToolBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Normal text">
          <Type size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={14} />
        </ToolBtn>

        <ToolbarDivider />

        {/* Inline marks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">
          <UnderlineIcon size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code size={14} />
        </ToolBtn>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
          <AlignCenter size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight size={14} />
        </ToolBtn>

        <ToolbarDivider />

        {/* Lists & blocks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote / tip">
          <Quote size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus size={14} />
        </ToolBtn>

        <ToolbarDivider />

        {/* Link */}
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Add/edit link">
          <Link2 size={14} />
        </ToolBtn>
        {editor.isActive('link') && (
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link" danger>
            <Link2Off size={14} />
          </ToolBtn>
        )}

        <ToolbarDivider />

        {/* Image */}
        <ToolBtn onClick={() => imageInputRef.current?.click()} title="Upload image from device">
          <ImageIcon size={14} />
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.58rem', marginLeft: 3, letterSpacing: '0.04em'}}>Upload</span>
        </ToolBtn>
        <ToolBtn onClick={handleImageUrl} title="Insert image from URL">
          <ImageIcon size={14} />
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.58rem', marginLeft: 3, letterSpacing: '0.04em'}}>URL</span>
        </ToolBtn>
        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageFile} style={{display: 'none'}} />
      </div>

      {/* ===== EDITOR BODY ===== */}
      <EditorContent
        editor={editor}
        style={{minHeight: 420}}
      />

      {/* ===== FOOTER ===== */}
      <div style={{
        borderTop: '1px dashed rgba(27,58,75,0.2)', padding: '4px 12px',
        background: '#F0EAD6',
        display: 'flex', gap: '1rem', alignItems: 'center',
      }}>
        <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#9C8E74', letterSpacing: '0.06em'}}>
          {wordCount} words &bull; {charCount} characters
        </span>
        <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#C9BEA0', marginLeft: 'auto', letterSpacing: '0.04em'}}>
          Click image to resize &bull; Ctrl+Z to undo
        </span>
      </div>

      <style>{`
        .tiptap {
          outline: none;
          padding: 1.25rem 1.5rem;
          font-family: var(--font-sans);
          font-size: 0.975rem;
          line-height: 1.75;
          color: #1f2937;
          min-height: 420px;
        }
        .tiptap p { margin: 0 0 0.875rem; }
        .tiptap h2 {
          font-family: var(--font-display);
          font-size: 2rem; letter-spacing: 0.03em;
          color: var(--color-buzz-navy); margin: 1.75rem 0 0.75rem;
          padding-bottom: 0.3rem;
          border-bottom: 2px solid var(--color-buzz-orange);
          line-height: 1;
        }
        .tiptap h3 {
          font-family: var(--font-display);
          font-size: 1.4rem; letter-spacing: 0.03em;
          color: var(--color-buzz-navy); margin: 1.5rem 0 0.6rem;
          line-height: 1;
        }
        .tiptap h4 {
          font-family: var(--font-sans); font-size: 1rem; font-weight: 700;
          color: var(--color-buzz-navy); margin: 1.25rem 0 0.5rem;
        }
        .tiptap blockquote {
          border-left: 4px solid var(--color-buzz-orange);
          background: rgba(232,101,10,0.06);
          margin: 1.25rem 0; padding: 0.875rem 1.25rem;
          font-family: var(--font-serif); font-style: italic;
          color: #4B3E2A; font-size: 1.05rem;
        }
        .tiptap blockquote p { margin: 0; }
        .tiptap code {
          background: #F0EAD6; border: 1px solid #C9BEA0;
          padding: 0.1em 0.35em; font-family: var(--font-mono);
          font-size: 0.85em; color: var(--color-buzz-navy);
        }
        .tiptap pre {
          background: var(--color-buzz-navy); color: #e5e7eb;
          padding: 1rem 1.25rem; overflow-x: auto;
          font-family: var(--font-mono); font-size: 0.85rem; margin: 1rem 0;
        }
        .tiptap ul { list-style: none; padding-left: 1.25rem; margin: 0.875rem 0; }
        .tiptap ul li { position: relative; padding-left: 0.25rem; margin-bottom: 0.35rem; }
        .tiptap ul li::before { content: '—'; position: absolute; left: -1.1rem; color: var(--color-buzz-orange); font-weight: 700; }
        .tiptap ol { padding-left: 1.5rem; margin: 0.875rem 0; }
        .tiptap ol li { margin-bottom: 0.35rem; }
        .tiptap a { color: var(--color-buzz-teal); text-decoration: underline; font-weight: 600; }
        .tiptap hr { border: none; border-top: 2px dashed rgba(27,58,75,0.3); margin: 2rem 0; }
        .tiptap img {
          max-width: 100%; display: block; margin: 1.25rem 0;
          border: 2.5px solid var(--color-buzz-navy);
          box-shadow: 4px 4px 0 var(--color-buzz-orange);
          cursor: pointer;
        }
        .tiptap img.ProseMirror-selectednode {
          outline: 3px solid var(--color-buzz-orange);
        }
        .tiptap strong { font-weight: 700; color: var(--color-buzz-navy); }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: #9C8E74; pointer-events: none; height: 0;
          font-style: italic;
        }
        .tiptap [data-text-align="center"] { text-align: center; }
        .tiptap [data-text-align="right"] { text-align: right; }
      `}</style>
    </div>
  );
}
