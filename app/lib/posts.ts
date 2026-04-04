import fs from 'fs'
import path from 'path'

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  author: string
  published: boolean
  createdAt: string
  updatedAt: string
}

const DATA_PATH = path.join(process.cwd(), 'data', 'posts.json')

function ensureDataFile() {
  const dir = path.dirname(DATA_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]', 'utf-8')
}

export function getAllPosts(): Post[] {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(raw) as Post[]
  } catch {
    return []
  }
}

export function getPublishedPosts(): Post[] {
  return getAllPosts()
    .filter(p => p.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find(p => p.slug === slug)
}

export function getPostById(id: string): Post | undefined {
  return getAllPosts().find(p => p.id === id)
}

export function savePost(post: Post): void {
  const posts = getAllPosts()
  const idx = posts.findIndex(p => p.id === post.id)
  if (idx >= 0) posts[idx] = post
  else posts.push(post)
  fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2), 'utf-8')
}

export function deletePost(id: string): void {
  const posts = getAllPosts().filter(p => p.id !== id)
  fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2), 'utf-8')
}
