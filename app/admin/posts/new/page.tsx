import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/lib/auth'
import PostEditor from '@/components/PostEditor'

export const metadata = { title: 'New Post | Admin' }

export default async function NewPost() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="noise" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
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
          <span style={{ fontSize: 11, color: 'var(--text-dimmer)', borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>New Post</span>
        </div>
        <Link href="/admin/posts" className="btn-ghost" style={{ fontSize: 11 }}>← All Posts</Link>
      </nav>

      <PostEditor isNew />
    </div>
  )
}
