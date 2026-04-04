import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { getAdminSession } from '@/lib/auth'
import AdminDeleteButton from './DeleteButton'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminPosts() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const posts = getAllPosts().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="noise" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,6,12,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 36px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, background: 'linear-gradient(90deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MicroKorant</span>
          </Link>
          <span style={{ fontSize: 11, color: 'var(--text-dimmer)', borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>Admin Console</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/blog" className="btn-ghost" style={{ fontSize: 11 }}>View Blog</Link>
          <form action="/api/auth" method="post">
            <input type="hidden" name="_action" value="logout"/>
            <button type="submit" className="btn-ghost" style={{ fontSize: 11 }}>Sign Out</button>
          </form>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 36px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Posts</h1>
            <p style={{ fontSize: 12, color: 'var(--text-dimmer)' }}>{posts.length} articles total · {posts.filter(p => p.published).length} published</p>
          </div>
          <Link href="/admin/posts/new" className="btn-primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Post
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
          {[
            { label: 'Total Posts', value: posts.length, color: '#a855f7' },
            { label: 'Published', value: posts.filter(p => p.published).length, color: '#10b981' },
            { label: 'Drafts', value: posts.filter(p => !p.published).length, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 11, padding: '14px 18px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)', marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Posts table */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {posts.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-dimmer)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✍️</div>
              <div>No posts yet. <Link href="/admin/posts/new" style={{ color: 'var(--purple)' }}>Create your first post →</Link></div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Tags', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--text-dimmer)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr key={post.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '14px 18px', maxWidth: 360 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-dimmer)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/{post.slug}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {post.tags.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: 9 }}>{t}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        color: post.published ? '#10b981' : '#f59e0b',
                        background: post.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        border: `1px solid ${post.published ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                      }}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 11, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                      {formatDate(post.createdAt)}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/blog/${post.slug}`} className="btn-ghost" style={{ fontSize: 10, padding: '5px 12px' }}>View</Link>
                        <Link href={`/admin/posts/${post.id}`} className="btn-ghost" style={{ fontSize: 10, padding: '5px 12px' }}>Edit</Link>
                        <AdminDeleteButton postId={post.id}/>
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
