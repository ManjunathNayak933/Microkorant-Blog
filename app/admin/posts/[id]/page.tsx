import Link from 'next/link'
import { getPostById, getAllPosts } from '@/lib/posts'
import PostEditor from '@/components/PostEditor'
import { notFound } from 'next/navigation'

interface Props { params: { id: string } }

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ id: p.id }))
}

export default function EditPost({ params }: Props) {
  const post = getPostById(params.id)
  if (!post) notFound()

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
          <span style={{ fontSize: 11, color: '#4b5563', borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 16 }}>Edit Post</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/blog/${post.slug}`} style={{ padding: '7px 16px', borderRadius: 9, fontSize: 11, color: '#9ca3af', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none' }}>View Live</Link>
          <Link href="/admin/posts" style={{ padding: '7px 16px', borderRadius: 9, fontSize: 11, color: '#9ca3af', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textDecoration: 'none' }}>All Posts</Link>
        </div>
      </nav>
      <PostEditor post={post} />
    </div>
  )
}
