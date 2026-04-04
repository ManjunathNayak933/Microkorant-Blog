import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'The Korant — Indian Marketing Intelligence',
  description: 'Sharp, independent analysis on how Indian consumer brands spend — and misplace — their marketing budgets.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function readTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

const CATEGORIES: Record<string, string> = {
  'attribution': 'Attribution',
  'influencer marketing': 'Influencer',
  'affiliate': 'Affiliate',
  'SEO': 'SEO & PR',
  'D2C India': 'D2C India',
  'agencies': 'Agencies',
  'marketing ROI': 'ROI',
}

function getCategory(tags: string[]): string {
  for (const t of tags) {
    const key = Object.keys(CATEGORIES).find(k => t.toLowerCase().includes(k.toLowerCase()))
    if (key) return CATEGORIES[key]
  }
  return 'Analysis'
}

export default function BlogIndex() {
  const posts = getPublishedPosts()
  const [hero, second, ...grid] = posts

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Masthead ── */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        {/* Top bar */}
        <div style={{ borderBottom: '1px solid var(--border)', padding: '0 48px', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Analysis', 'Influencer', 'Affiliate', 'D2C India', 'Agencies'].map(c => (
              <span key={c} style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'default' }}>{c}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-dimmer)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Nameplate */}
        <div style={{ padding: '28px 48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            By MicroKorant
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.95, color: 'var(--text)', marginBottom: 14 }}>
            The Korant
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', maxWidth: 440, lineHeight: 1.7, fontWeight: 300 }}>
            Sharp, independent analysis on influencer marketing, affiliate programs, and how Indian consumer brands spend — and misplace — their budgets.
          </p>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="https://www.microkorant.in" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, padding: '6px 16px', borderRadius: 6, border: '1px solid rgba(196,181,253,0.25)', background: 'rgba(196,181,253,0.06)' }}>
              Track your marketing →
            </Link>
          </div>
        </div>

        {/* Rule */}
        <div style={{ margin: '0 48px', height: 1, background: 'linear-gradient(90deg, transparent, var(--border-mid), transparent)' }}/>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 96px' }}>

        {/* ── Hero + Second story ── */}
        {hero && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, marginBottom: 0, borderBottom: '1px solid var(--border)' }}>

            {/* Hero */}
            <Link href={`/blog/${hero.slug}`} style={{ display: 'block', padding: '0 32px 36px 0', borderRight: '1px solid var(--border)' }}>
              <div className="fade-up" style={{ paddingTop: 32 }}>
                <span className="category">{getCategory(hero.tags)}</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, lineHeight: 1.15, color: 'var(--text)', margin: '16px 0 14px', letterSpacing: '-0.025em' }}>
                  {hero.title}
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 20, fontWeight: 300, maxWidth: 560 }}>
                  {hero.excerpt}
                </p>
                {hero.coverImage && (
                  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20, position: 'relative', paddingTop: '52%' }}>
                    <Image src={hero.coverImage} alt={hero.title} fill style={{ objectFit: 'cover' }}/>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-dim)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{hero.author}</span>
                  <span>·</span>
                  <span>{formatDate(hero.createdAt)}</span>
                  <span>·</span>
                  <span>{readTime(hero.content)} min read</span>
                </div>
              </div>
            </Link>

            {/* Second story + small list */}
            <div style={{ paddingLeft: 32, paddingTop: 32, paddingBottom: 36 }}>
              {second && (
                <Link href={`/blog/${second.slug}`} style={{ display: 'block', paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
                  <span className="category">{getCategory(second.tags)}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, lineHeight: 1.3, color: 'var(--text)', margin: '10px 0 8px', letterSpacing: '-0.01em' }}>
                    {second.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300, marginBottom: 12 }}>
                    {second.excerpt.slice(0, 120)}…
                  </p>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{formatDate(second.createdAt)} · {readTime(second.content)} min</div>
                </Link>
              )}

              {/* Small story list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {grid.slice(0, 3).map((post, i) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ display: 'flex', gap: 14, paddingBottom: 18, marginBottom: 18, borderBottom: i < 2 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--text-dimmer)', lineHeight: 1, marginTop: 3, minWidth: 28 }}>
                      {String(i + 3).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="category" style={{ fontSize: 9, padding: '2px 8px' }}>{getCategory(post.tags)}</span>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 700, lineHeight: 1.4, color: 'var(--text)', margin: '6px 0 4px' }}>
                        {post.title}
                      </h4>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{formatDate(post.createdAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Remaining grid ── */}
        {grid.length > 3 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>More from The Korant</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px 24px' }}>
              {grid.slice(3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ display: 'block' }}>
                  <article>
                    {post.coverImage && (
                      <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 14, position: 'relative', paddingTop: '58%' }}>
                        <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }}/>
                      </div>
                    )}
                    <span className="category" style={{ fontSize: 9 }}>{getCategory(post.tags)}</span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 700, lineHeight: 1.35, color: 'var(--text)', margin: '10px 0 8px', letterSpacing: '-0.01em' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 10, fontWeight: 300, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{formatDate(post.createdAt)} · {readTime(post.content)} min</div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-dim)' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginBottom: 8 }}>The first dispatch is coming.</div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>The Korant</span>
          <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>by MicroKorant</span>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 11 }}>
          <Link href="https://www.microkorant.in" style={{ color: 'var(--text-dim)' }}>MicroKorant Platform</Link>
          <Link href="/admin/login" style={{ color: 'var(--text-dimmer)' }}>Admin</Link>
          <a href="mailto:admin@microkorant.in" style={{ color: 'var(--text-dim)' }}>Contact</a>
        </div>
      </footer>
    </div>
  )
}
