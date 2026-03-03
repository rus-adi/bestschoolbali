import { getAllPosts, getPostBySlug } from "../../../lib/posts";
import type { Metadata } from "next";
import { remark } from "remark";
import html from "remark-html";
import { getAllAreas, getAllCurriculums } from "../../../lib/taxonomy";
import { getAllSchools } from "../../../lib/schools";
import { slugify } from "../../../lib/slug";
import { sortSchoolsForMarketplace } from "../../../lib/sort";
import JsonLd from "../../../components/JsonLd";

export const dynamicParams = false;
export const dynamic = "error";

export function generateStaticParams(): { slug: string }[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

const SITE_URL = "https://bestschoolbali.com";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  const title = post.title;
  const description = post.excerpt ?? "Guides for choosing a school in Bali.";
  const image = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/img/banners/blog.webp`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [{ url: image }],
    },
  };
}

async function renderMarkdown(md: string) {
  const result = await remark().use(html).process(md);
  return result.toString();
}

function uniqBy<T>(items: T[], key: (t: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function buildDirectoryShortcuts(tags: string[]) {
  const areas = getAllAreas();
  const curriculums = getAllCurriculums();

  const areaMap = new Map(areas.map((a) => [a.name.toLowerCase(), a] as const));
  const curriculumMap = new Map(curriculums.map((c) => [c.slug, c] as const));

  const areaLinks = uniqBy(
    tags
      .map((t) => areaMap.get(String(t).toLowerCase()))
      .filter(Boolean)
      .map((a) => ({ name: a!.name, slug: a!.slug })),
    (a) => a.slug,
  );

  const curriculumLinks = uniqBy(
    tags
      .map((t) => curriculumMap.get(slugify(t)))
      .filter(Boolean)
      .map((c) => ({ name: c!.tag, slug: c!.slug })),
    (c) => c.slug,
  );

  const wantsFees = tags.some((t) => /fees|budget|cost/i.test(String(t)));
  const wantsAdmissions = tags.some((t) => /admissions|documents|timeline/i.test(String(t)));
  const wantsAreas = areaLinks.length > 0 || tags.some((t) => /commute|area/i.test(String(t)));

  const quickLinks: Array<{ label: string; href: string }> = [
    { label: "Schools directory", href: "/schools" },
    { label: "Areas", href: "/areas" },
    { label: "Curriculums", href: "/curriculums" },
  ];

  if (wantsFees) {
    quickLinks.push({ label: "Fees overview", href: "/fees" });
    quickLinks.push({ label: "Budget bands", href: "/budget" });
  }

  if (wantsAdmissions) {
    quickLinks.push({ label: "Admissions guide", href: "/blog/admissions-timeline-and-documents" });
  }

  if (wantsAreas) {
    quickLinks.push({ label: "Area comparisons", href: "/compare/areas" });
  }

  quickLinks.push({ label: "Get guidance", href: "/contact" });

  return { areaLinks, curriculumLinks, quickLinks: uniqBy(quickLinks, (x) => x.href) };
}

function recommendSchoolsForPost(opts: { areaLinks: Array<{ name: string; slug: string }>; curriculumLinks: Array<{ name: string; slug: string }> }) {
  const all = getAllSchools();
  const base = sortSchoolsForMarketplace(all);
  const baseOrder = new Map(base.map((s, idx) => [s.id, idx] as const));

  const areaNames = new Set(opts.areaLinks.map((a) => a.name));
  const curriculumSlugs = new Set(opts.curriculumLinks.map((c) => c.slug));

  const scored = all
    .map((s) => {
      let score = 0;

      const areas = s.areas?.length ? s.areas : [s.area];
      if (areas.some((a) => areaNames.has(a))) score += 3;

      const schoolCurrSlugs = (s.curriculum_tags ?? []).map((t) => slugify(t));
      if (schoolCurrSlugs.some((slug) => curriculumSlugs.has(slug))) score += 3;

      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (baseOrder.get(a.s.id) ?? 9999) - (baseOrder.get(b.s.id) ?? 9999);
    });

  return scored.slice(0, 6).map((x) => x.s);
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const contentHtml = await renderMarkdown(post.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    image: post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/img/banners/blog.webp`,
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Best School Bali",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/img/brand/logo.webp`,
      },
    },
  };

  const heroImg = post.image ?? "/img/banners/blog.webp";
  const tags = (post.tags ?? []).map((t) => String(t).trim()).filter(Boolean);

  const shortcuts = buildDirectoryShortcuts(tags);
  const suggestedSchools = recommendSchoolsForPost({
    areaLinks: shortcuts.areaLinks,
    curriculumLinks: shortcuts.curriculumLinks,
  });

  return (
    <article className="container">
      <JsonLd data={articleSchema} />
      <div className="inlineLinks" style={{ marginTop: 18 }}>
        <a className="btn" href="/guides">
          ← Guides
        </a>
        <a className="btn" href="/schools">
          Browse schools
        </a>
        <a className="btn" href="/fees">
          Fees guide
        </a>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h1>{post.title}</h1>
        <div className="small">
          {post.date}
          {post.category ? ` · ${post.category}` : ""}
        </div>

        {tags.length ? (
          <div className="tagRow" style={{ marginTop: 10 }}>
            {tags.slice(0, 6).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="postHero" aria-hidden="true" style={{ marginTop: 14 }}>
          <img src={heroImg} alt="" loading="lazy" />
        </div>

        <div style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Directory shortcuts</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Quick links based on this guide. Use these pages for up-to-date fees, ages, and admissions notes.
          </p>

          {shortcuts.areaLinks.length ? (
            <>
              <div className="small" style={{ marginTop: 10 }}>
                <strong>Areas</strong>
              </div>
              <div className="tagRow" style={{ marginTop: 8 }}>
                {shortcuts.areaLinks.map((a) => (
                  <a key={a.slug} className="tag" href={`/areas/${a.slug}`}>
                    {a.name}
                  </a>
                ))}
              </div>
            </>
          ) : null}

          {shortcuts.curriculumLinks.length ? (
            <>
              <div className="small" style={{ marginTop: 12 }}>
                <strong>Curriculums</strong>
              </div>
              <div className="tagRow" style={{ marginTop: 8 }}>
                {shortcuts.curriculumLinks.map((c) => (
                  <a key={c.slug} className="tag" href={`/curriculums/${c.slug}`}>
                    {c.name}
                  </a>
                ))}
              </div>
            </>
          ) : null}

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            {shortcuts.quickLinks.slice(0, 5).map((l) => (
              <a key={l.href} className="btn" href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Suggested school profiles</h2>
          <p className="small" style={{ marginTop: 0 }}>
            A few profiles that match this guide’s topic. Use them as starting points, not final answers.
          </p>

          {suggestedSchools.length ? (
            <div className="grid" style={{ marginTop: 12 }}>
              {suggestedSchools.map((s) => (
                <a key={s.id} className="card schoolCard" href={`/schools/${s.id}`}>
                  <div className="schoolCardMedia" aria-hidden="true">
                    <img src={`/img/schools/${s.id}.webp`} alt={s.name} loading="lazy" />
                  </div>
                  <div className="schoolCardBody">
                    <div className="schoolCardTitle">
                      {s.name}
                      {s.verification?.status === "verified" ? <span className="pill">Verified</span> : null}
                      {s.sponsorship?.sponsored ? <span className="pill pillSponsored">Sponsored</span> : null}
                    </div>
                    <div className="small">
                      <a href={`/areas/${slugify(s.area)}`}>{s.area}</a>
                      {s.type ? ` · ${s.type}` : ""}
                    </div>
                    <div className="small" style={{ marginTop: 6 }}>
                      {s.fees?.display ?? "Fees: contact school"}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Browse the directory for the latest profiles.
            </p>
          )}

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href="/schools">
              Open directory
            </a>
            <a className="btn" href="/compare">
              Compare schools
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get guidance
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
