'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'

interface Props {
  post?: Post
  isNew?: boolean
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const TOOLBAR_ACTIONS = [
  { label: 'B', title: 'Bold', tag: 'strong' },
  { label: 'I', title: 'Italic', tag: 'em' },
  { label: 'H2', title: 'Heading 2', tag: 'h2' },
  { label: 'H3', title: 'Heading 3', tag: 'h3' },
  { label: '❝', title: 'Blockquote', tag: 'blockquote' },
  { label: '—', title: 'Divider', tag: 'hr' },
]

export default function PostEditor({ post, isNew }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [author, setAuthor] = useState(post?.author || 'MicroKorant Team')
  const [coverImage, setCoverImage] = useState(post?.coverImage || '')
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')
  const [tab, setTab] = useState<'write'|'preview'>('write')
  const [uploading, setUploading] = useState(false)
  const [inlineUploading, setInlineUploading] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const inlineRef = useRef<HTMLInputElement>(null)

  function handleTitleChange(v: string) {
    setTitle(v)
    if (isNew) setSlug(slugify(v))
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
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) setCoverImage(url)
    setUploading(false)
  }

  async function handleInlineImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setInlineUploading(true)
    const url = await uploadImage(file)
    if (url) insertAtCursor(`<img src="${url}" alt="Image" />`)
    setInlineUploading(false)
    // reset
    if (inlineRef.current) inlineRef.current.value = ''
  }

  function insertAtCursor(text: string) {
    const el = contentRef.current
    if (!el) { setContent(c => c + '\n' + text); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const before = content.substring(0, start)
    const after = content.substring(end)
    const selected = content.substring(start, end)

    // If it's a block element insertion
    if (text === '<hr/>') {
      setContent(before + '\n<hr/>\n' + after)
      return
    }
    setContent(before + text + selected + after)
  }

  function wrapSelection(tag: string) {
    const el = contentRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = content.substring(start, end)
    const before = content.substring(0, start)
    const after = content.substring(end)
    if (tag === 'hr') { setContent(before + '\n<hr/>\n' + after); return }
    if (selected) {
      setContent(before + `<${tag}>${selected}</${tag}>` + after)
    } else {
      setContent(before + `<${tag}></${tag}>` + after)
    }
  }

  function insertParagraph() {
    const el = contentRef.current
    if (!el) return
    const pos = el.selectionStart
    const before = content.substring(0, pos)
    const after = content.substring(pos)
    setContent(before + '\n<p></p>\n' + after)
  }

  async function handleSave(pub?: boolean) {
    if (!title.trim()) { setErr('Title is required'); return }
    if (!slug.trim()) { setErr('Slug is required'); return }
    setSaving(true); setErr(''); setSuccess('')
    try {
      const body = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author: author.trim() || 'MicroKorant Team',
        coverImage: coverImage.trim(),
        published: pub !== undefined ? pub : published,
      }
      const url = isNew ? '/api/posts' : `/api/posts/${post!.id}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSuccess(isNew ? 'Post created!' : 'Saved!')
      if (pub !== undefined) setPublished(pub)
      if (isNew) router.push(`/admin/posts/${data.id}`)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, maxWidth: 1200, margin: '0 auto', padding: '32px 36px' }}>
      {/* Main editor */}
      <div>
        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <input
            style={{ ...inp, fontSize: 22, fontFamily: 'var(--font-serif)', fontWeight: 400, padding: '14px 18px', border: '1px solid transparent', background: 'transparent', borderBottom: '1px solid var(--border)' }}
            placeholder="Post title…"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
          />
        </div>

        {/* Slug */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>/blog/</span>
          <input
            style={{ ...inp, fontSize: 12, flex: 1, color: 'var(--text-dim)', fontFamily: 'monospace' }}
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="post-slug-here"
          />
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.03)', borderRadius: 9, padding: 3, marginBottom: 12, width: 'fit-content' }}>
          {(['write', 'preview'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '5px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', background: tab === t ? 'rgba(168,85,247,0.15)' : 'transparent', color: tab === t ? 'var(--purple-light)' : 'var(--text-dimmer)' }}>
              {t === 'write' ? '✏️ Write' : '👁 Preview'}
            </button>
          ))}
        </div>

        {tab === 'write' && (
          <>
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderBottom: 'none', borderRadius: '10px 10px 0 0', flexWrap: 'wrap' }}>
              {TOOLBAR_ACTIONS.map(a => (
                <button key={a.label} title={a.title} onClick={() => wrapSelection(a.tag)}
                  style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: a.tag.startsWith('h') ? 10 : 13, fontWeight: a.tag === 'strong' ? 700 : 400, fontStyle: a.tag === 'em' ? 'italic' : 'normal', fontFamily: 'inherit' }}>
                  {a.label}
                </button>
              ))}
              <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }}/>
              <button onClick={insertParagraph} title="New paragraph"
                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
                ¶ Para
              </button>
              <button onClick={() => inlineRef.current?.click()} disabled={inlineUploading}
                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(168,85,247,0.25)', background: 'rgba(168,85,247,0.07)', color: 'var(--purple-light)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                🖼 {inlineUploading ? 'Uploading…' : 'Insert Image'}
              </button>
              <input ref={inlineRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleInlineImage}/>
            </div>

            {/* Content textarea */}
            <textarea
              ref={contentRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your article in HTML. Use <p>, <h2>, <strong>, <ul>, etc. or use the toolbar above."
              style={{
                ...inp,
                minHeight: 500,
                resize: 'vertical',
                borderRadius: '0 0 10px 10px',
                lineHeight: 1.7,
                fontFamily: '"Fira Mono", "Consolas", monospace',
                fontSize: 12,
              }}
            />
          </>
        )}

        {tab === 'preview' && (
          <div style={{ padding: '28px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, minHeight: 300 }}>
            {content ? (
              <article className="prose" dangerouslySetInnerHTML={{ __html: content }}/>
            ) : (
              <p style={{ color: 'var(--text-dimmer)', fontStyle: 'italic' }}>Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Publish actions */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 13, padding: '18px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Publish</div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 9 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: published ? 'var(--green)' : 'var(--amber)', background: published ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${published ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, borderRadius: 20, padding: '2px 10px' }}>
              {published ? 'Published' : 'Draft'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => handleSave()} disabled={saving} className="btn-ghost" style={{ justifyContent: 'center', width: '100%' }}>
              {saving ? 'Saving…' : '💾 Save Draft'}
            </button>
            <button onClick={() => handleSave(!published)} disabled={saving} className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
              {saving ? 'Saving…' : published ? '📤 Unpublish' : '🚀 Publish'}
            </button>
          </div>

          {err && <div style={{ marginTop: 10, fontSize: 11, color: '#fca5a5', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, padding: '8px 12px' }}>{err}</div>}
          {success && <div style={{ marginTop: 10, fontSize: 11, color: '#6ee7b7', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 7, padding: '8px 12px' }}>✓ {success}</div>}
        </div>

        {/* Cover image */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 13, padding: '18px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Cover Image</div>
          {coverImage ? (
            <div style={{ marginBottom: 10, borderRadius: 9, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', paddingTop: '56%' }}>
              <img src={coverImage} alt="Cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
          ) : (
            <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: 9, marginBottom: 10, cursor: 'pointer' }} onClick={() => coverRef.current?.click()}>
              <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>Click to upload</span>
            </div>
          )}
          <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload}/>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => coverRef.current?.click()} disabled={uploading} className="btn-ghost" style={{ flex: 1, fontSize: 11, justifyContent: 'center' }}>
              {uploading ? 'Uploading…' : coverImage ? '↻ Replace' : '↑ Upload'}
            </button>
            {coverImage && <button onClick={() => setCoverImage('')} className="btn-ghost" style={{ fontSize: 11 }}>✕</button>}
          </div>
          <div style={{ marginTop: 10 }}>
            <label className="field-label">Or enter URL</label>
            <input className="field-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://…" style={{ fontSize: 11 }}/>
          </div>
        </div>

        {/* Excerpt */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 13, padding: '18px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Excerpt</div>
          <textarea
            className="field-input"
            rows={3}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="A short summary shown on the blog listing…"
            style={{ fontSize: 12, lineHeight: 1.6 }}
          />
        </div>

        {/* Tags */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 13, padding: '18px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Tags</div>
          <input className="field-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="influencer, D2C India, SEO" style={{ fontSize: 12 }}/>
          <div style={{ fontSize: 10, color: 'var(--text-dimmer)', marginTop: 5 }}>Comma-separated</div>
          {tags && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
              {tags.split(',').map(t => t.trim()).filter(Boolean).map(t => <span key={t} className="tag" style={{ fontSize: 9 }}>{t}</span>)}
            </div>
          )}
        </div>

        {/* Author */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 13, padding: '18px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Author</div>
          <input className="field-input" value={author} onChange={e => setAuthor(e.target.value)} placeholder="MicroKorant Team" style={{ fontSize: 12 }}/>
        </div>

        {/* Back link */}
        <a href="/admin/posts" style={{ fontSize: 11, color: 'var(--text-dimmer)', textAlign: 'center', paddingTop: 4 }}>← Back to posts</a>
      </div>
    </div>
  )
}
