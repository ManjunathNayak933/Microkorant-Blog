import { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.microkorant.in').replace(/\/$/, '')

  let posts: ReturnType<typeof getPublishedPosts> = []

  try {
    posts = await Promise.resolve(getPublishedPosts())
  } catch (err) {
    console.error('sitemap: failed to load posts', err)
  }

  return [
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map(post => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
