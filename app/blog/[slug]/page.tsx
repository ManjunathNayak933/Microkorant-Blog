import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'
export const dynamic = 'force-dynamic'

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
      title: `${post.title} · The Korant`,
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
function readTime(html: string) {
  return Math.max(1, Math.round(html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length / 220))
}

const CATEGORIES: Record<string, string> = {
  'attribution': 'Attribution', 'influencer marketing': 'Influencer',
  'affiliate': 'Affiliate', 'SEO': 'SEO & PR', 'D2C India': 'D2C India',
  'agencies': 'Agencies', 'marketing ROI': 'ROI',
}
function getCategory(tags: string[]): string {
  for (const t of tags) {
    const key = Object.keys(CATEGORIES).find(k => t.toLowerCase().includes(k.toLowerCase()))
    if (key) return CATEGORIES[key]
  }
  return 'Analysis'
}

export default function BlogPost({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post || !post.published) notFound()

  const all = getPublishedPosts()
  const related = all.filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t))).slice(0, 3)
  const rt = readTime(post.content)
  const cat = getCategory(post.tags)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Nav ── */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 48px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(16px)' }}>
        <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>The Korant</span>
          <span style={{ fontSize: 10, color: 'var(--text-dimmer)', borderLeft: '1px solid var(--border)', paddingLeft: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>by MicroKorant</span>
        </Link>
        <Link href="/blog" style={{ fontSize: 11, color: 'var(--text-dim)', padding: '5px 14px', border: '1px solid var(--border)', borderRadius: 6 }}>
          ← All Stories
        </Link>
      </nav>

      {/* ── Article header ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '52px 40px 0' }}>
        <div className="fade-up">
          <span className="category">{cat}</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text)', margin: '18px 0 20px', letterSpacing: '-0.03em' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 28, fontWeight: 300, fontStyle: 'italic' }}>
            {post.excerpt}
          </p>

          {/* Byline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 28, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {post.author.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{post.author}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>The Korant</div>
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: 'var(--border)' }}/>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{formatDate(post.createdAt)}</div>
            <div style={{ width: 1, height: 28, background: 'var(--border)' }}/>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{rt} min read</div>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="fade-up d1" style={{ margin: '32px 0', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative', paddingTop: '52%' }}>
            <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }}/>
          </div>
        )}

        {/* Body */}
        <article className="prose fade-up d2" style={{ paddingBottom: 64 }} dangerouslySetInnerHTML={{ __html: post.content }}/>

        {/* ── MicroKorant CTA ── subtle, earned ── */}
        <div style={{ margin: '0 0 64px', padding: '28px 32px', background: 'linear-gradient(135deg, rgba(91,33,182,0.08), rgba(124,58,237,0.04))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>MicroKorant</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>
                The attribution platform built for what you just read about.
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                Track every influencer, affiliate, and publication in one dashboard. See which channels actually drive sales — not just clicks.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'center' }}>
              <Link href="https://www.microkorant.in" style={{ padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', whiteSpace: 'nowrap', textAlign: 'center' }}>
                See the Platform →
              </Link>
              <Link href="/blog" style={{ padding: '9px 22px', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', border: '1px solid var(--border)', textAlign: 'center' }}>
                More from The Korant
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related ── */}
      {related.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '48px 0 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Continue Reading</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {related.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} style={{ display: 'block' }}>
                  <article style={{ padding: '20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, transition: 'border-color 0.2s' }}>
                    <span className="category" style={{ fontSize: 9 }}>{getCategory(rp.tags)}</span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--text)', margin: '10px 0 8px' }}>
                      {rp.title}
                    </h3>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{formatDate(rp.createdAt)}</div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>The Korant</span>
        <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>Independent analysis by MicroKorant</span>
      </footer>
    </div>
  )
}
