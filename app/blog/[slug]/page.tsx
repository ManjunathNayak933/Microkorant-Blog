import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getPublishedPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function estimateReadTime(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

export default function BlogPost({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post || !post.published) notFound()

  const related = getPublishedPosts().filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t))).slice(0, 3)
  const readTime = estimateReadTime(post.content)

  return (
    <div className="noise" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,6,12,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 48px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link href="https://www.microkorant.in" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, background: 'linear-gradient(90deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MicroKorant</span>
          </Link>
          <span style={{ fontSize: 12, color: 'var(--text-dimmer)', borderLeft: '1px solid var(--border)', paddingLeft: 18 }}>Blog</span>
        </div>
        <Link href="/blog" style={{ fontSize: 12, color: 'var(--text-dim)', padding: '5px 14px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
          ← All Articles
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 40px 0' }}>
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 400, lineHeight: 1.12, color: 'var(--text)', marginBottom: 18 }}>{post.title}</h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 22, fontWeight: 300 }}>{post.excerpt}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-dimmer)', paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {post.author.charAt(0)}
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{post.author}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-dimmer)', display: 'inline-block' }}/>
            <span>{formatDate(post.createdAt)}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-dimmer)', display: 'inline-block' }}/>
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="fade-up fade-up-d1" style={{ marginBottom: 36, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', height: 380 }}>
            <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }}/>
          </div>
        )}

        {/* Content */}
        <article
          className="prose fade-up fade-up-d2"
          style={{ marginBottom: 64 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginBottom: 40 }}>
          <div style={{ padding: '20px 24px', background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.18)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>Track every rupee of your marketing spend</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Influencers, affiliates, publications — one dashboard.</div>
            </div>
            <Link href="https://www.microkorant.in" style={{ padding: '9px 20px', borderRadius: 9, fontSize: 12, fontWeight: 600, color: 'white', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', whiteSpace: 'nowrap' }}>
              Try MicroKorant →
            </Link>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 48px 80px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, marginBottom: 20, color: 'var(--text)' }}>Related Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {related.map(rp => (
              <Link key={rp.id} href={`/blog/${rp.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <article style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {rp.tags.slice(0, 1).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 400, lineHeight: 1.35, color: 'var(--text)', marginBottom: 8 }}>{rp.title}</h3>
                  <div style={{ fontSize: 10, color: 'var(--text-dimmer)' }}>{formatDate(rp.createdAt)}</div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>© 2026 MicroKorant</span>
        <Link href="/blog" style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>← Back to Blog</Link>
      </footer>
    </div>
  )
}
