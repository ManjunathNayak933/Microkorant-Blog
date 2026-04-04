import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, savePost } from '@/lib/posts'
import { getAdminSession } from '@/lib/auth'
import { v4 as uuid } from 'uuid'

export async function GET() {
  const posts = getAllPosts()
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { title, slug, excerpt, content, tags, author, coverImage, published } = body

    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })
    if (!slug?.trim())  return NextResponse.json({ error: 'Slug required' }, { status: 400 })

    // Check slug uniqueness
    const existing = getAllPosts()
    if (existing.some(p => p.slug === slug.trim())) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const post = {
      id: uuid(),
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt?.trim() || '',
      content: content?.trim() || '',
      tags: Array.isArray(tags) ? tags : [],
      author: author?.trim() || 'MicroKorant Team',
      coverImage: coverImage?.trim() || '',
      published: Boolean(published),
      createdAt: now,
      updatedAt: now,
    }

    savePost(post)
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
