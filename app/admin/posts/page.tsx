'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  tags: string[]
  published: boolean
  createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function DeleteButton({ postId, onDeleted }: { postId: string; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
      onDeleted()
    } catch {
      alert('Delete failed')
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={handleDelete} disabled={loading}
          style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>
          {loading ? '...' : 'Confirm'}
        </button>
        <button onClick={() => setConfirming(false)}
          style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)', color: '#9ca3af', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)}
      style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>
      Delete
    </button>
  )
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/posts')
      if (res.status === 401) { window.location.href = '/admin/login'; return }
      const data = await res.json()
      setPosts(data.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPosts() }, [])

  async function handleLogout() {
    await fetch('/api/auth', { method: 'POST', body: new URLSearchParams({ _action: 'logout' }), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    window.location.href = '/admin/login'
  }

  const published = posts.filter(p => p.published).length
  const drafts = posts.filter(p => !p.published).length

  return (
    <div className="noise" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(6,6,12,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 36px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, background: 'linear-gradient(90deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MicroKorant</span>
          </Link>
          <span style={{ fontSize: 11, color: '#4b5563', borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 16 }}>Admin Console</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/blog" style={{ padding: '7px 16px', borderRadius: 9, fontSize: 11, color: '#9ca3af', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none' }}>View Blog</Link>
          <button onClick={handleLogout} style={{ padding: '7px 16px', borderRadius: 9, fontSize: 11, color: '#9ca3af', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 4 }}>Posts</h1>
            <p style={{ fontSize: 12, color: '#4b5563' }}>{posts.length} articles total · {published} published</p>
          </div>
          <Link href="/admin/posts/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', textDecoration: 'none' }}>
            + New Post
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
          {[{ label: 'Total Posts', value: posts.length, color: '#a855f7' }, { label: 'Published', value: published, color: '#10b981' }, { label: 'Drafts', value: drafts, color: '#f59e0b' }].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: '14px 18px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#4b5563', fontSize: 13 }}>Loading...</div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#4b5563' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>No posts yet.</div>
              <Link href="/admin/posts/new" style={{ color: '#a855f7' }}>Create your first post</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Title', 'Tags', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr key={post.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '14px 18px', maxWidth: 360 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'white', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                      <div style={{ fontSize: 10, color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/{post.slug}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {post.tags.slice(0, 2).map(t => (
                          <span key={t} style={{ fontSize: 9, fontWeight: 600, color: '#c084fc', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 20, padding: '3px 10px' }}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, color: post.published ? '#10b981' : '#f59e0b', background: post.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${post.published ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{formatDate(post.createdAt)}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/blog/${post.slug}`} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)', color: '#9ca3af', fontSize: 10, textDecoration: 'none' }}>View</Link>
                        <Link href={`/admin/posts/${post.id}`} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)', color: '#9ca3af', fontSize: 10, textDecoration: 'none' }}>Edit</Link>
                        <DeleteButton postId={post.id} onDeleted={loadPosts} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
