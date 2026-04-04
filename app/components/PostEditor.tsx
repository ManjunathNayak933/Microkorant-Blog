'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'

interface Props { post?: Post; isNew?: boolean }

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

// ── Toolbar button ──────────────────────────────────────────
function ToolBtn({ title, onClick, active, children }: { title: string; onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      style={{
        padding: '5px 9px', borderRadius: 5, border: 'none', cursor: 'pointer',
        fontSize: 12, fontFamily: 'inherit', fontWeight: active ? 700 : 400,
        background: active ? 'rgba(196,181,253,0.15)' : 'rgba(255,255,255,0.04)',
        color: active ? 'var(--accent)' : 'var(--text-muted)',
        transition: 'all 0.1s',
      }}
    >
      {children}
    </button>
  )
}

export default function PostEditor({ post, isNew }: Props) {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const inlineRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [author, setAuthor] = useState(post?.author || 'The Korant')
  const [coverImage, setCoverImage] = useState(post?.coverImage || '')
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [inlineUploading, setInlineUploading] = useState(false)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')
  const coverRef = useRef<HTMLInputElement>(null)

  // Seed editor content on mount
  useEffect(() => {
    if (editorRef.current && post?.content) {
      editorRef.current.innerHTML = post.content
    }
  }, [])

  function handleTitleChange(v: string) {
    setTitle(v)
    if (isNew) setSlug(slugify(v))
  }

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
  }

  function isActive(cmd: string) {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  function insertHeading(tag: 'h2' | 'h3') {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    const block = document.createElement(tag)
    block.innerHTML = sel.toString() || 'Heading'
    range.deleteContents()
    range.insertNode(block)
    range.setStartAfter(block)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
    editorRef.current?.focus()
  }

  function insertHr() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    const hr = document.createElement('hr')
    range.collapse(false)
    range.insertNode(hr)
    range.setStartAfter(hr)
    sel.removeAllRanges()
    sel.addRange(range)
    editorRef.current?.focus()
  }

  function insertLink() {
    const url = window.prompt('Enter URL:')
    if (url) exec('createLink', url)
  }

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) return null
    const d = await res.json()
    return d.url
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) setCoverImage(url)
    setUploading(false)
  }

  async function handleInlineImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setInlineUploading(true)
    const url = await uploadImage(file)
    if (url) {
      editorRef.current?.focus()
      exec('insertImage', url)
    }
    setInlineUploading(false)
    if (inlineRef.current) inlineRef.current.value = ''
  }

  async function handleSave(pub?: boolean) {
    if (!title.trim()) { setErr('Title is required'); return }
    if (!slug.trim()) { setErr('Slug is required'); return }
    const content = editorRef.current?.innerHTML || ''
    setSaving(true); setErr(''); setSuccess('')
    try {
      const body = {
        title: title.trim(), slug: slug.trim(), excerpt: excerpt.trim(),
        content, tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author: author.trim() || 'The Korant',
        coverImage: coverImage.trim(),
        published: pub !== undefined ? pub : published,
      }
      const url = isNew ? '/api/posts' : `/api/posts/${post!.id}`
      const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSuccess(isNew ? 'Post created!' : 'Saved!')
      if (pub !== undefined) setPublished(pub)
      if (isNew) router.push(`/admin/posts/${data.id}`)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Save failed')
    } finally { setSaving(false) }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, maxWidth: 1200, margin: '0 auto', padding: '28px 36px' }}>

      {/* ── Left: editor ── */}
      <div>
        {/* Title */}
        <input
          value={title} onChange={e => handleTitleChange(e.target.value)}
          placeholder="Article title…"
          style={{ ...inp, fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 700, border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0, background: 'transparent', marginBottom: 12, padding: '8px 0' }}
        />

        {/* Slug */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>/blog/</span>
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="article-slug"
            style={{ ...inp, fontSize: 11, fontFamily: 'monospace', flex: 1, color: 'var(--text-dim)', padding: '6px 10px' }}/>
        </div>

        {/* ── WYSIWYG Toolbar ── */}
        <div style={{
          display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center',
          padding: '8px 10px', background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)', borderBottom: 'none',
          borderRadius: '10px 10px 0 0',
        }}>
          <ToolBtn title="Bold" onClick={() => exec('bold')} active={isActive('bold')}><strong>B</strong></ToolBtn>
          <ToolBtn title="Italic" onClick={() => exec('italic')} active={isActive('italic')}><em>I</em></ToolBtn>
          <ToolBtn title="Underline" onClick={() => exec('underline')} active={isActive('underline')}><u>U</u></ToolBtn>

          <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 3px' }}/>

          <ToolBtn title="Heading 2" onClick={() => insertHeading('h2')}>H2</ToolBtn>
          <ToolBtn title="Heading 3" onClick={() => insertHeading('h3')}>H3</ToolBtn>

          <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 3px' }}/>

          <ToolBtn title="Bullet list" onClick={() => exec('insertUnorderedList')} active={isActive('insertUnorderedList')}>• List</ToolBtn>
          <ToolBtn title="Numbered list" onClick={() => exec('insertOrderedList')} active={isActive('insertOrderedList')}>1. List</ToolBtn>

          <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 3px' }}/>

          <ToolBtn title="Blockquote" onClick={() => exec('formatBlock', 'blockquote')}>❝ Quote</ToolBtn>
          <ToolBtn title="Divider" onClick={insertHr}>— Rule</ToolBtn>
          <ToolBtn title="Link" onClick={insertLink}>🔗 Link</ToolBtn>
          <ToolBtn title="Remove link" onClick={() => exec('unlink')}>Unlink</ToolBtn>

          <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 3px' }}/>

          <button
            onMouseDown={e => { e.preventDefault(); inlineRef.current?.click() }}
            disabled={inlineUploading}
            style={{ padding: '5px 11px', borderRadius: 5, border: '1px solid rgba(196,181,253,0.2)', background: 'rgba(196,181,253,0.06)', color: 'var(--accent)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
            {inlineUploading ? 'Uploading…' : '🖼 Image'}
          </button>
          <input ref={inlineRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleInlineImage}/>
        </div>

        {/* ── Editable content area ── */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Start writing your article here. Use the toolbar above to format your text — no HTML needed."
          style={{
            minHeight: 480,
            padding: '20px 22px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '0 0 10px 10px',
            outline: 'none',
            fontSize: 15,
            lineHeight: 1.85,
            color: '#d0cee0',
            fontFamily: 'var(--font-sans)',
          }}
          onKeyDown={e => {
            // Tab → indent
            if (e.key === 'Tab') { e.preventDefault(); exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;') }
          }}
        />

        {/* Placeholder CSS trick via a style tag */}
        <style>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #3d3b52;
            pointer-events: none;
            font-style: italic;
          }
          [contenteditable] h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: #f0eff4; margin: 1.8em 0 0.6em; line-height: 1.2; }
          [contenteditable] h3 { font-size: 1.05rem; font-weight: 600; color: #f0eff4; margin: 1.5em 0 0.5em; }
          [contenteditable] blockquote { border-left: 3px solid #c4b5fd; padding: 0.7em 1.2em; margin: 1.5em 0; background: rgba(124,58,237,0.07); border-radius: 0 6px 6px 0; color: #9896a8; font-style: italic; }
          [contenteditable] ul, [contenteditable] ol { padding-left: 1.6em; margin: 0.8em 0; }
          [contenteditable] li { margin-bottom: 0.3em; }
          [contenteditable] a { color: #c4b5fd; text-decoration: underline; }
          [contenteditable] img { max-width: 100%; border-radius: 8px; margin: 1em 0; border: 1px solid rgba(255,255,255,0.1); }
          [contenteditable] hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2em 0; }
          [contenteditable] strong { color: #f0eff4; }
        `}</style>
      </div>

      {/* ── Right: sidebar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Publish */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Publish</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: published ? 'var(--green)' : '#f59e0b', background: published ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${published ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: 20, padding: '2px 10px' }}>
              {published ? 'Published' : 'Draft'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => handleSave()} disabled={saving} className="btn-ghost" style={{ justifyContent: 'center', width: '100%', fontSize: 12 }}>
              {saving ? 'Saving…' : '💾 Save Draft'}
            </button>
            <button onClick={() => handleSave(!published)} disabled={saving} className="btn-primary" style={{ justifyContent: 'center', width: '100%', fontSize: 12 }}>
              {saving ? 'Saving…' : published ? '📤 Unpublish' : '🚀 Publish'}
            </button>
          </div>
          {err && <div style={{ marginTop: 10, fontSize: 11, color: '#fca5a5', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 7, padding: '8px 12px' }}>{err}</div>}
          {success && <div style={{ marginTop: 10, fontSize: 11, color: '#6ee7b7', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 7, padding: '8px 12px' }}>✓ {success}</div>}
        </div>

        {/* Cover image */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Cover Image</div>
          {coverImage
            ? <div style={{ marginBottom: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', paddingTop: '56%' }}>
                <img src={coverImage} alt="Cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
            : <div onClick={() => coverRef.current?.click()} style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: 8, marginBottom: 10, cursor: 'pointer' }}>
                <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>Click to upload cover</span>
              </div>
          }
          <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload}/>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => coverRef.current?.click()} disabled={uploading} className="btn-ghost" style={{ flex: 1, fontSize: 11, justifyContent: 'center' }}>
              {uploading ? 'Uploading…' : coverImage ? '↻ Replace' : '↑ Upload'}
            </button>
            {coverImage && <button onClick={() => setCoverImage('')} className="btn-ghost" style={{ fontSize: 11 }}>✕</button>}
          </div>
          <div style={{ marginTop: 10 }}>
            <label className="field-label">Or paste URL</label>
            <input className="field-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://…" style={{ fontSize: 11 }}/>
          </div>
        </div>

        {/* Excerpt */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Excerpt</div>
          <textarea className="field-input" rows={3} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="One or two sentences shown on the homepage and in search results…" style={{ fontSize: 12, lineHeight: 1.6 }}/>
        </div>

        {/* Tags */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Tags</div>
          <input className="field-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="D2C India, attribution, influencer marketing" style={{ fontSize: 12 }}/>
          <div style={{ fontSize: 10, color: 'var(--text-dimmer)', marginTop: 5 }}>Comma-separated. Determines the category shown on article pages.</div>
          {tags && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
              {tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', background: 'var(--gold-dim)', border: '1px solid rgba(240,192,96,0.2)', borderRadius: 3, padding: '2px 8px' }}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Author */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Author</div>
          <input className="field-input" value={author} onChange={e => setAuthor(e.target.value)} placeholder="The Korant" style={{ fontSize: 12 }}/>
        </div>

        <a href="/admin/posts" style={{ fontSize: 11, color: 'var(--text-dimmer)', textAlign: 'center', paddingTop: 4 }}>← Back to posts</a>
      </div>
    </div>
  )
}
