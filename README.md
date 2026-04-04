# MicroKorant Blog

A dark-themed, SEO-optimised Next.js blog for MicroKorant — India's marketing attribution platform.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **File-based data store** (`data/posts.json`) — no external DB needed
- **jose** for JWT auth
- **Railway** deployment ready

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/blog`.

---

## Admin Panel

Visit `/admin/login` to sign in and manage posts.

The admin console lets you:
- Create, edit, and delete posts
- Upload cover images and inline images
- Toggle published / draft status
- Preview HTML content before publishing

---

## Deploying to Railway

1. Push this repo to GitHub.
2. In Railway → **New Project → Deploy from GitHub repo**.
3. Railway auto-detects Next.js via `railway.toml`.
4. Add these environment variables in Railway's dashboard:

| Variable | Value |
|---|---|
| `JWT_SECRET` | Any long random string (e.g. 64 random chars) |
| `NEXT_PUBLIC_SITE_URL` | Your Railway domain, e.g. `https://blog.microkorant.in` |
| `NODE_ENV` | `production` |

5. Hit **Deploy**. Railway builds and starts `npm run start`.

### Persistent uploads on Railway

Railway's filesystem is ephemeral between deploys. For production, point uploads to an S3-compatible bucket:

1. Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`, `AWS_REGION` env vars.
2. Replace the `writeFile` logic in `app/api/upload/route.ts` with an S3 `PutObjectCommand`.
3. Change the returned URL to your CDN/S3 URL.

For simple use, Railway's filesystem is fine — images persist between restarts but not between redeploys.

---

## Project Structure

```
microkorant-blog/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── globals.css         # Brand styles (matches microkorant.in)
│   ├── page.tsx            # Redirects / → /blog
│   ├── sitemap.ts          # Auto-generated sitemap
│   ├── robots.ts           # robots.txt
│   ├── blog/
│   │   ├── page.tsx        # Blog index
│   │   └── [slug]/
│   │       └── page.tsx    # Individual post
│   ├── admin/
│   │   ├── page.tsx        # Redirects → /admin/posts
│   │   ├── login/
│   │   │   └── page.tsx    # Login form
│   │   └── posts/
│   │       ├── page.tsx    # Post list
│   │       ├── DeleteButton.tsx
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   └── api/
│       ├── auth/route.ts   # Login / logout
│       ├── posts/
│       │   ├── route.ts    # GET list, POST create
│       │   └── [id]/route.ts # GET, PUT, DELETE
│       └── upload/route.ts # Image upload
├── components/
│   └── PostEditor.tsx      # Rich HTML editor with image upload
├── lib/
│   ├── posts.ts            # File-based post store
│   └── auth.ts             # JWT helpers
├── data/
│   └── posts.json          # Seeded with 5 articles
├── public/
│   └── uploads/            # Uploaded images
├── railway.toml
└── next.config.js
```

---

## Writing Posts

Content is written in HTML. Supported tags the editor wraps:

- `<p>` — paragraph
- `<h2>`, `<h3>` — headings
- `<strong>`, `<em>` — inline formatting
- `<blockquote>` — pull quotes
- `<ul>`, `<ol>`, `<li>` — lists
- `<img src="…" alt="…" />` — inline images (use toolbar button to upload)
- `<hr/>` — divider

Use the **Insert Image** toolbar button to upload a photo directly into the body of your post at the cursor position.
