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

// Seed articles bundled as a JS constant — used as fallback if posts.json is empty or missing.
// This means posts always appear even if the filesystem was reset.
const SEED_POSTS: Post[] = [
  {
    id: "1",
    title: "The Measurement Gap: Why Indian D2C Brands Are Flying Blind on Marketing Spend",
    slug: "measurement-gap-indian-d2c-brands-marketing-spend",
    excerpt: "Across the country's fastest-growing consumer brands, a quiet crisis is unfolding in spreadsheets. Marketing budgets are growing. Attribution infrastructure is not keeping pace.",
    content: "<p>Every Monday morning, somewhere in Mumbai or Bengaluru or Delhi, a brand manager is doing the same thing: opening three separate Excel sheets, copying numbers from agency reports into a master file, and trying to figure out whether the ₹18 lakh spent on influencer campaigns last month actually moved the needle.</p><p>This scene, repeated across hundreds of India's direct-to-consumer brands, represents one of the most consequential inefficiencies in the country's marketing economy. Money is moving. But the infrastructure to understand where it goes — and what it does — hasn't kept up.</p><h2>The scale of the problem</h2><p>India's D2C sector is now a serious commercial force. By most estimates, it crossed ₹50,000 crore in gross merchandise value in 2023 and continues to expand rapidly, fueled by a generation of founders who understand digital marketing well and are willing to invest in it aggressively.</p><p>But aggressive spending and intelligent spending are not the same thing.</p><p>The brands getting this wrong aren't unsophisticated. They have CMOs with good instincts and agencies with real capabilities. The problem is structural. Their attribution infrastructure — the systems that connect marketing actions to business outcomes — was built for a simpler era, when a brand ran one or two channels and could loosely track what worked.</p><p>Today, the typical funded D2C brand might be running influencer campaigns across fifteen creators, editorial placements in six publications, an affiliate program with twenty partners, performance ads on Google and Meta, and podcast sponsorships on top of that. Each of these channels has its own reporting format, its own definition of a conversion, and its own incentive to present numbers favorably.</p><h2>How attribution breaks down</h2><p>The breakdown happens at the seams between channels.</p><p>Consider a customer's actual journey. She sees a fitness creator's reel about a protein brand on Tuesday. She doesn't click. Three days later, she sees a review in a health newsletter she subscribes to. She clicks through but doesn't buy. On Saturday, she searches for the brand directly, finds it, and purchases.</p><p>In most attribution setups, this sale gets credited entirely to organic search. The influencer gets zero credit. The newsletter gets zero credit. The brand's performance marketing team reports an efficient acquisition. The influencer team reports poor conversion. And nobody in the room has a clear picture of what actually drove the sale.</p><h2>What the best-run brands are doing differently</h2><p>A growing cohort of brands has figured out a different approach. They've stopped treating attribution as an agency responsibility and started treating it as core infrastructure that the brand owns.</p><p>The mechanics are straightforward: every external partner — influencer, publication, affiliate, agency — gets a unique tracking link. Every campaign runs through the same attribution layer. Commission codes provide a secondary attribution path for customers who screenshot links and buy later. And all of this data feeds into a unified view that the brand controls, not any individual vendor.</p><p>The result isn't just cleaner reporting. It changes the entire dynamic of agency relationships. When every partner's performance is measured against the same standard, the conversations stop being about vanity metrics and start being about cost per sale.</p>",
    coverImage: "",
    tags: ["attribution", "D2C India", "marketing ROI"],
    author: "The Korant",
    published: true,
    createdAt: "2026-01-20T09:00:00.000Z",
    updatedAt: "2026-01-20T09:00:00.000Z"
  },
  {
    id: "2",
    title: "The Creator Economy's Dirty Secret: Most Brand Deals Aren't Tracked",
    slug: "creator-economy-brand-deals-not-tracked",
    excerpt: "India has one of the world's most active influencer marketing markets. It also has one of the weakest attribution cultures. The gap between what brands pay and what they can prove is wider than most will admit.",
    content: "<p>India's influencer marketing industry is projected to reach ₹3,375 crore by 2026. What's less discussed is how much of that spend is effectively unaccountable — deployed without the infrastructure to know whether it worked.</p><p>The standard setup for an influencer campaign in India is remarkably low-tech. A creator posts content. The brand monitors likes, comments, shares, saves, and story views. Maybe they give the creator a discount code. At the end of the month, the agency compiles these numbers into a PDF report with some screenshots and an estimated media value calculation.</p><h2>Why estimated media value misleads</h2><p>Estimated media value — the practice of comparing an influencer post's reach to what equivalent advertising space would cost — is perhaps the most widely used and most misleading metric in the industry. It tells you how much the eyeballs would cost on a billboard. It tells you nothing about whether any of those eyeballs belong to people who would ever buy your product.</p><p>The brands that have moved past this are running every influencer through a proper tracking architecture: unique redirect links that capture clicks at the individual creator level, discount codes as a backup attribution path, cookie windows long enough to capture the delayed purchase that happens three days after the Instagram story.</p><h2>Why agencies aren't solving this</h2><p>Most influencer agencies are organized around creative and relationship functions: finding the right creators, negotiating deals, managing content approval. Building and maintaining a technical attribution layer is a different capability entirely, and most agencies haven't invested in it.</p><p>There's also a subtler incentive problem. An agency that provides rigorous per-creator attribution data is an agency that makes it easy to see which of its creator relationships are underperforming. The measurement function shouldn't live with the agency. It should live with the brand.</p>",
    coverImage: "",
    tags: ["influencer marketing", "D2C India", "attribution"],
    author: "The Korant",
    published: true,
    createdAt: "2026-02-03T09:00:00.000Z",
    updatedAt: "2026-02-03T09:00:00.000Z"
  },
  {
    id: "3",
    title: "The Quiet Power of Affiliate Programs: How Indian Brands Are Building Sales Teams They Don't Employ",
    slug: "affiliate-programs-india-ambassador-model",
    excerpt: "A growing number of Indian D2C brands are discovering that their most effective salespeople are customers who were never hired, never trained, and only get paid when they deliver.",
    content: "<p>Meenakshi runs a food blog from Pune. She has 8,400 Instagram followers, a modestly trafficked website, and a genuine passion for artisanal food products. She also, without particularly trying to build a business around it, earns somewhere between ₹4,000 and ₹12,000 a month recommending products she uses to an audience that trusts her judgment.</p><p>She is, in the language of performance marketing, an affiliate. But the founders of the brands she partners with tend to call her something else: an ambassador. The distinction matters more than it sounds.</p><h2>Why this works in India</h2><p>The cultural logic behind ambassador programs maps onto how purchasing decisions actually get made in India. Research consistently shows that recommendations from trusted personal networks carry more weight here than in most Western markets.</p><p>WhatsApp groups, resident welfare association networks, alumni communities, and workplace social circles are the actual channels through which product recommendations travel in Indian middle-class life. A formal ambassador program systematizes and incentivizes behavior that was already happening informally.</p><h2>The operational requirements</h2><p>Brands that have built successful ambassador programs emphasize frictionless onboarding: programs that require extensive paperwork or multi-day waits lose momentum. The moment of enthusiasm — when a customer wants to tell her friends about a product she loves — is perishable.</p><p>Dual attribution matters too. Tracking links capture digital clicks. But a significant portion of ambassador-driven sales happen through discount codes shared in voice notes, screenshots, and face-to-face conversations. A program that relies solely on link clicks is systematically undercounting conversions.</p>",
    coverImage: "",
    tags: ["affiliate", "ambassador programs", "D2C India"],
    author: "The Korant",
    published: true,
    createdAt: "2026-02-17T09:00:00.000Z",
    updatedAt: "2026-02-17T09:00:00.000Z"
  },
  {
    id: "4",
    title: "Editorial Placements as Infrastructure: The Long Game Indian Brands Aren't Playing",
    slug: "editorial-placements-seo-infrastructure-india",
    excerpt: "When a brand gets featured in YourStory or Inc42, most marketers treat it as a PR win. A small number treat it as an asset that will still be working in three years. The difference in outcomes is significant.",
    content: "<p>In early 2024, a Bengaluru-based skincare brand secured a feature in one of India's most-read business publications. Twelve months later, that article was still driving an average of 340 visitors per month to the brand's website — over 4,000 sessions from a single piece of content that required no ongoing investment to maintain.</p><h2>The asset versus expense distinction</h2><p>Most marketing spend is expense: you pay for reach or attention, and when you stop paying, the effect stops. Editorial placements in high-authority publications operate differently. A well-placed article continues to rank in search results, generate referral traffic, and pass link equity to the brand's website for months or years afterward.</p><p>This distinction matters enormously for how brands should think about allocating marketing budgets — and for how they should measure the ROI of editorial placements.</p><h2>What most brands get wrong about measurement</h2><p>The standard approach — counting placements, estimating reach, calculating earned media value — is deeply flawed. Estimated media value says nothing about whether anyone read the article, clicked through, or took any commercial action.</p><p>Better measurement starts with UTM-tagged tracking links in every article. It layers in branded search volume analysis. It looks at traffic decay curves to understand which articles continue driving traffic over time. And it calculates cost per click against performance marketing benchmarks, so editorial placements compete for budget on comparable terms.</p>",
    coverImage: "",
    tags: ["SEO", "publications", "D2C India", "marketing ROI"],
    author: "The Korant",
    published: true,
    createdAt: "2026-03-03T09:00:00.000Z",
    updatedAt: "2026-03-03T09:00:00.000Z"
  },
  {
    id: "5",
    title: "Managing Multiple Marketing Agencies: The Coordination Problem Nobody Talks About",
    slug: "managing-multiple-marketing-agencies-india",
    excerpt: "The typical funded Indian D2C brand works with three to five agencies simultaneously. The data fragmentation this creates is costly, misunderstood, and almost entirely avoidable.",
    content: "<p>At any given time, Priya's brand has five people she considers her marketing team. None of them are on payroll. There's the influencer agency in Gurugram. The PR studio in Mumbai. The affiliate network coordinator. The Google Ads freelancer. And the Meta specialist her co-founder found through LinkedIn.</p><p>Priya is the founder of a Pune-based personal care brand. She spends about ₹8 lakh a month on marketing. She has never, in two years of operation, had a single dashboard that showed her what all of that money was doing.</p><h2>The attribution conflict problem</h2><p>When different agencies all try to claim credit for the same conversions, their numbers don't just fail to add up — they actively mislead. A customer might be claimed by the influencer agency (using a longer attribution window), the PR agency (tracking referral traffic), and the performance team (last-click). The brand's reported numbers add up to more than 100% of actual conversions.</p><h2>What shared infrastructure looks like</h2><p>The solution is architectural: the brand needs to own its attribution layer, and every agency needs to plug into it rather than running parallel measurement systems. Every external partner operates through the brand's tracking infrastructure. Agencies can still see their own performance data — but the brand sees everything, on the same scale, using the same attribution methodology.</p><p>What's interesting about brands that move to this model is what it does to their agency relationships. Agencies that are genuinely performing benefit immediately — their real results are visible and undeniable. Agencies that were obscuring poor performance behind favorable metric selection have a harder time. This is a feature, not a bug.</p>",
    coverImage: "",
    tags: ["agencies", "attribution", "marketing ops", "D2C India"],
    author: "The Korant",
    published: true,
    createdAt: "2026-03-18T09:00:00.000Z",
    updatedAt: "2026-03-18T09:00:00.000Z"
  }
]

function ensureDataFile() {
  const dir = path.dirname(DATA_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_PATH)) {
    // Seed with bundled posts so they always appear on first deploy
    fs.writeFileSync(DATA_PATH, JSON.stringify(SEED_POSTS, null, 2), 'utf-8')
  }
}

export function getAllPosts(): Post[] {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Post[]
    // If file exists but is empty array, seed it
    if (parsed.length === 0) {
      fs.writeFileSync(DATA_PATH, JSON.stringify(SEED_POSTS, null, 2), 'utf-8')
      return SEED_POSTS
    }
    return parsed
  } catch {
    return SEED_POSTS
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
