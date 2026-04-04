import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'MicroKorant Blog',
  description: 'Insights on influencer marketing, affiliate programs, SEO, and marketing attribution for Indian D2C brands.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogIndex() {
  const posts = getPublishedPosts()
  const [hero, ...rest] = posts

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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="https://www.microkorant.in" style={{ fontSize: 12, color: 'var(--text-dim)', padding: '5px 14px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
            ← Back to Platform
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '64px 48px 96px' }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 56, maxWidth: 540 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, padding: '4px 14px', marginBottom: 18 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--purple)', animation: 'pulse 2s ease-in-out infinite' }}/>
            <span style={{ fontSize: 10, color: 'var(--purple-light)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Marketing Intelligence</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, lineHeight: 1.12, marginBottom: 14 }}>
            The D2C Marketing<br/><em style={{ color: 'var(--purple-light)' }}>Intelligence Desk</em>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 300 }}>
            Influencer attribution, affiliate programs, SEO, and everything Indian consumer brands need to understand where their marketing rupees actually go.
          </p>
        </div>

        {/* Hero post */}
        {hero && (
          <Link href={`/blog/${hero.slug}`} className="fade-up fade-up-d1" style={{ display: 'block', marginBottom: 40 }}>
            <article style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: 18, overflow: 'hidden',
              transition: 'all 0.25s',
              position: 'relative',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.45)'; (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
            >
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#7c3aed,#a855f7,#db2777,transparent)' }}/>
              {hero.coverImage && (
                <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
                  <Image src={hero.coverImage} alt={hero.title} fill style={{ objectFit: 'cover' }}/>
                </div>
              )}
              <div style={{ padding: '32px 36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--purple)', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 20, padding: '3px 10px' }}>Latest</span>
                  {hero.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px,2.5vw,32px)', fontWeight: 400, lineHeight: 1.2, color: 'var(--text)', marginBottom: 12 }}>{hero.title}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 18, maxWidth: 640, fontWeight: 300 }}>{hero.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-dimmer)' }}>
                  <span>{hero.author}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-dimmer)', display: 'inline-block' }}/>
                  <span>{formatDate(hero.createdAt)}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--purple-light)', fontWeight: 600, fontSize: 12 }}>Read article →</span>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Post grid */}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {rest.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className={`fade-up fade-up-d${Math.min(i + 2, 5)}`}
                style={{ display: 'block' }}
              >
                <article style={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: 14, overflow: 'hidden',
                  transition: 'all 0.22s',
                  position: 'relative',
                  display: 'flex', flexDirection: 'column',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.03)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                >
                  {post.coverImage && (
                    <div style={{ height: 160, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }}/>
                    </div>
                  )}
                  <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 11 }}>
                      {post.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 400, lineHeight: 1.35, color: 'var(--text)', marginBottom: 9, flex: 1 }}>{post.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dimmer)' }}>
                      <span>{formatDate(post.createdAt)}</span>
                      <span style={{ color: 'var(--purple)', fontWeight: 600 }}>Read →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
            <div style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>No posts yet</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-dimmer)' }}>© 2026 MicroKorant · India's Marketing Command Center</span>
        <div style={{ display: 'flex', gap: 20, fontSize: 11 }}>
          <Link href="https://www.microkorant.in" style={{ color: 'var(--text-dimmer)' }}>Platform</Link>
          <Link href="https://www.microkorant.in/login" style={{ color: 'var(--text-dimmer)' }}>Sign In</Link>
          <a href="mailto:admin@microkorant.in" style={{ color: 'var(--text-dimmer)' }}>Contact</a>
        </div>
      </footer>
    </div>
  )
}
