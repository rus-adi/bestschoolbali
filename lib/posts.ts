import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;

  /** Optional content grouping for a "Guides" hub UI. */
  category?: string;
  tags?: string[];

  /** Optional hero image path (public/...), used for previews. */
  image?: string;
};

export type Post = PostMeta & {
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "posts");

type RequiredFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
};

type OptionalFrontmatter = {
  category?: unknown;
  tags?: unknown;
  image?: unknown;
};

function assertFrontmatter(
  data: any,
  slug: string
): asserts data is RequiredFrontmatter & OptionalFrontmatter {
  if (!data?.title || !data?.date || !data?.excerpt) {
    throw new Error(`Missing required frontmatter fields in post: ${slug}`);
  }
}

function byDateDesc(a: PostMeta, b: PostMeta) {
  return b.date.localeCompare(a.date);
}

export function getAllPosts(): PostMeta[] {
  const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR) : [];
  const posts: PostMeta[] = files
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(POSTS_DIR, filename);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      assertFrontmatter(data, slug);
      return {
        slug,
        title: String(data.title),
        date: String(data.date),
        excerpt: String(data.excerpt),
        category: data.category ? String(data.category) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map((t: any) => String(t)) : undefined,
        image: data.image ? String(data.image) : undefined,
      };
    })
    .sort(byDateDesc);

  return posts;
}

export function getLatestPost(): PostMeta | null {
  const all = getAllPosts();
  return all.length ? all[0] : null;
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  assertFrontmatter(data, slug);
  return {
    slug,
    title: String(data.title),
    date: String(data.date),
    excerpt: String(data.excerpt),
    category: data.category ? String(data.category) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map((t: any) => String(t)) : undefined,
    image: data.image ? String(data.image) : undefined,
    content,
  };
}

export function getGuideCategories(): Array<{ name: string; count: number }> {
  const posts = getAllPosts();
  const counts = new Map<string, number>();
  for (const p of posts) {
    const c = (p.category ?? "").trim();
    if (!c) continue;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Simple, deterministic guide recommendations.
 * (Static-export friendly — no tracking, no personalization.)
 */
export function recommendGuides(opts: {
  area?: string;
  curriculumTags?: string[];
  budget?: string;
  limit?: number;
}): PostMeta[] {
  const posts = getAllPosts();
  const limit = opts.limit ?? 3;

  // Priority list of slugs we want to surface. (Only include if present.)
  const picks: string[] = [];

  // Universal starters.
  picks.push("choose-a-school");
  picks.push("school-fees-in-bali");
  picks.push("admissions-timeline-and-documents");

  // Area-specific.
  const area = (opts.area ?? "").toLowerCase();
  if (area.includes("canggu") || area.includes("ubud")) {
    picks.push("canggu-vs-ubud-for-families");
  }

  // Curriculum-specific.
  const tags = (opts.curriculumTags ?? []).map((t) => String(t).toLowerCase());
  if (tags.some((t) => t.includes("ib") || t.includes("cambridge") || t.includes("british"))) {
    picks.push("ib-vs-british-vs-cambridge");
  }

  // Budget context.
  const budget = (opts.budget ?? "").toLowerCase();
  if (budget.includes("lux")) {
    picks.push("school-fees-in-bali");
  }

  const bySlug = new Map(posts.map((p) => [p.slug, p] as const));
  const unique = Array.from(new Set(picks)).map((s) => bySlug.get(s)).filter(Boolean) as PostMeta[];

  if (unique.length >= limit) return unique.slice(0, limit);

  // Fill with the newest posts.
  const extras = posts.filter((p) => !unique.some((u) => u.slug === p.slug));
  return unique.concat(extras.slice(0, Math.max(0, limit - unique.length)));
}
