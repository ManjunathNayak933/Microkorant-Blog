import { NextRequest, NextResponse } from 'next/server'
import { getPostById, savePost, deletePost, getAllPosts } from '@/lib/posts'
import { getAdminSession } from '@/lib/auth'

interface Context { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Context) {
  const post = getPostById(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: Context) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = getPostById(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const body = await req.json()
    const { title, slug, excerpt, content, tags, author, coverImage, published } = body

    if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })
    if (!slug?.trim())  return NextResponse.json({ error: 'Slug required' }, { status: 400 })

    // Check slug uniqueness (excluding self)
    const all = getAllPosts()
    if (all.some(p => p.slug === slug.trim() && p.id !== params.id)) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 400 })
    }

    const updated = {
      ...post,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt?.trim() || '',
      content: content?.trim() || '',
      tags: Array.isArray(tags) ? tags : [],
      author: author?.trim() || 'MicroKorant Team',
      coverImage: coverImage?.trim() || '',
      published: Boolean(published),
      updatedAt: new Date().toISOString(),
    }

    savePost(updated)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = getPostById(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  deletePost(params.id)
  return NextResponse.json({ ok: true })
}
