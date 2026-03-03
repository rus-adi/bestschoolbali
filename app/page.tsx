import type { Metadata } from "next";
import { getAllPosts, getLatestPost } from "../lib/posts";
import { getAllSchools, type School } from "../lib/schools";
import { slugify } from "../lib/slug";
import { getAllBudgets, getAllCurriculums } from "../lib/taxonomy";
import { getSponsoredSchools } from "../lib/sort";

const SITE_URL = "https://bestschoolbali.com";

const AREA_THUMBS = new Set([
  "amed",
  "bukit-region",
  "canggu",
  "canggu-sanur",
  "denpasar",
  "sanur",
  "ubud",
]);

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Best School Bali",
  description:
    "A practical directory for families: compare schools in Bali by area, curriculum, ages, and budget. View fees ranges and admissions notes, then shortlist with confidence.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Best School Bali",
    description:
      "Compare schools in Bali by area, curriculum, ages, and budget — with fee ranges, profiles, and practical guidance for parents.",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
  },
};

function uniqueSorted(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function topSchools(all: School[]) {
  const lookup = new Map(all.map((s) => [s.id, s] as const));

  // Curated, stable set (update whenever you want new homepage highlights).
  const ids = ["green-school-bali", "canggu-community-school", "bali-island-school", "acs-bali"];

  const picked = ids.map((id) => lookup.get(id)).filter(Boolean) as School[];
  if (picked.length) return picked;

  // Fallback: first 4 in alphabetical order.
  return all.slice(0, 4);
}

export default function HomePage() {
  const latest = getLatestPost();
  const schools = getAllSchools();
  const posts = getAllPosts();

  const areas = uniqueSorted(schools.map((s) => s.area));
  const areaCounts = new Map<string, number>();
  for (const s of schools) areaCounts.set(s.area, (areaCounts.get(s.area) ?? 0) + 1);

  const tags = getAllCurriculums().map((t) => t.tag);
  const budgets = getAllBudgets().map((b) => b.name);
  const featured = topSchools(schools);
  const sponsored = getSponsoredSchools(schools).slice(0, 4);

  return (
    <div>
      <section className="homeHero">
        <div className="container">
          <div className="homeHeroInner">
            <div>
              <h1 className="homeHeroTitle">
                Find the <span className="accent">Best School</span> in Bali
              </h1>
              <p className="homeHeroSubtitle">Compare, Explore &amp; Choose the Perfect Education for Your Child</p>

              <div className="heroBadges" aria-label="Highlights">
                <div className="badgePill">
                  <span className="badgeIcon" aria-hidden="true">
                    ✓
                  </span>
                  Verified profiles
                </div>
                <div className="badgePill">
                  <span className="badgeIcon" aria-hidden="true">
                    ★
                  </span>
                  Parent perspectives
                </div>
                <div className="badgePill">
                  <span className="badgeIcon" aria-hidden="true">
                    ☎
                  </span>
                  Free guidance
                </div>
              </div>

              <form className="heroSearchCard" action="/schools" method="GET">
                <div className="searchGrid">
                  <div className="searchField">
                    <div className="searchLabel">
                      <span className="searchLabelIcon" aria-hidden="true">
                        ⌄
                      </span>
                      Area
                    </div>
                    <select className="select" name="area" defaultValue="">
                      <option value="">Choose area...</option>
                      {areas.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="searchField">
                    <div className="searchLabel">
                      <span className="searchLabelIcon" aria-hidden="true">
                        ⌁
                      </span>
                      Curriculum
                    </div>
                    <select className="select" name="tag" defaultValue="">
                      <option value="">Select curriculum...</option>
                      {tags.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="searchField">
                    <div className="searchLabel">
                      <span className="searchLabelIcon" aria-hidden="true">
                        $
                      </span>
                      Budget
                    </div>
                    <select className="select" name="budget" defaultValue="">
                      <option value="">Select budget...</option>
                      {budgets.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button className="btn btnPrimary searchBtn" type="submit">
                    Search Schools
                  </button>
                </div>
              </form>
            </div>

            <div className="homeHeroMedia" aria-hidden="true">
              <img src="/img/hero/home-hero.webp" alt="" />
            </div>
          </div>

          <div className="chipRow" aria-label="Quick filters">
            <a className="chip" href="/schools?q=International">
              <span className="chipIcon" aria-hidden="true">
                ◎
              </span>
              International Schools
            </a>
            <a className="chip" href="/schools?tag=Indonesian">
              <span className="chipIcon" aria-hidden="true">
                ⊙
              </span>
              Bali Local Schools
            </a>
            <a className="chip" href="/schools?tag=Montessori">
              <span className="chipIcon" aria-hidden="true">
                ◈
              </span>
              Montessori &amp; IB
            </a>
            <a className="chip" href="/schools?budget=Budget">
              <span className="chipIcon" aria-hidden="true">
                ◍
              </span>
              Affordable &amp; Premium
            </a>
          </div>
        </div>
      </section>

      {sponsored.length ? (
        <section className="section">
          <div className="container">
            <div className="sectionHead">
              <h2>Sponsored schools</h2>
              <a className="sectionLink" href="/methodology">
                How sponsorship works <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="tileGrid">
              {sponsored.map((s) => (
                <a key={s.id} className="schoolTile" href={`/schools/${s.id}`}>
                  <img src={`/img/schools/${s.id}.webp`} alt="" loading="lazy" />
                  <div className="schoolTileShade" aria-hidden="true" />
                  <div className="schoolTileContent">
                    <div className="schoolTileTitle">{s.name}</div>
                    <div className="schoolTileMeta">
                      {s.area}
                      {s.type ? ` · ${s.type}` : ""}
                    </div>
                    <div className="schoolTilePills" aria-label="School tags">
                      <span className="schoolTilePill schoolTilePillSponsored">Sponsored</span>
                      {s.budget_category ? <span className="schoolTilePill">{s.budget_category}</span> : null}
                      {(s.curriculum_tags ?? []).slice(0, 1).map((t) => (
                        <span key={t} className="schoolTilePill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <h2>Top Schools in Bali</h2>
            <a className="sectionLink" href="/schools">
              View All Schools <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="tileGrid">
            {featured.map((s) => (
              <a key={s.id} className="schoolTile" href={`/schools/${s.id}`}>
                <img src={`/img/schools/${s.id}.webp`} alt="" loading="lazy" />
                <div className="schoolTileShade" aria-hidden="true" />
                <div className="schoolTileContent">
                  <div className="schoolTileTitle">{s.name}</div>
                  <div className="schoolTileMeta">
                    {s.area}
                    {s.type ? ` · ${s.type}` : ""}
                  </div>
                  {s.budget_category || (s.curriculum_tags ?? []).length ? (
                    <div className="schoolTilePills" aria-label="School tags">
                      {s.budget_category ? <span className="schoolTilePill">{s.budget_category}</span> : null}
                      {(s.curriculum_tags ?? []).slice(0, 2).map((t) => (
                        <span key={t} className="schoolTilePill">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <h2>Popular Areas in Bali</h2>
            <a className="sectionLink" href="/areas">
              Explore Areas <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="areaScroller">
            {areas.map((a) => {
              const slug = slugify(a);
              const count = areaCounts.get(a) ?? 0;
              const thumb = AREA_THUMBS.has(slug) ? `/img/areas/${slug}.webp` : "/img/banners/hero.webp";
              return (
                <a key={a} className="areaTile" href={`/areas/${slug}`}>
                  <img src={thumb} alt="" loading="lazy" />
                  <div className="areaTileBody">
                    <div className="areaTileTitle">{a}</div>
                    <div className="areaTileMeta">{count} Schools</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <h2>Fees &amp; budget</h2>
            <a className="sectionLink" href="/fees">
              Fees overview <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid" style={{ marginTop: 14 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Browse by budget band</h3>
              <p className="small" style={{ marginTop: 0 }}>
                Use budget bands to narrow the directory quickly. Then confirm the total first-year cost directly with
                admissions.
              </p>
              <a className="btn btnLink" href="/budget">
                View budget bands <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Browse by school type</h3>
              <p className="small" style={{ marginTop: 0 }}>
                Use type labels as a quick shortcut — then confirm curriculum and language of instruction in the school
                profile.
              </p>
              <a className="btn btnLink" href="/types">
                Browse types <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Fee notes &amp; estimates</h3>
              <p className="small" style={{ marginTop: 0 }}>
                See which schools list fees publicly and which ranges are best-effort estimates.
              </p>
              <a className="btn btnLink" href="/fees/estimate">
                Open fee notes <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>How we label info</h3>
              <p className="small" style={{ marginTop: 0 }}>
                Read our methodology for fees, curriculum tags, parent perspectives, and sponsored placements.
              </p>
              <a className="btn btnLink" href="/methodology">
                Read methodology <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <h2>From the guide</h2>
            <a className="sectionLink" href="/blog">
              Read the Guides <span aria-hidden="true">→</span>
            </a>
          </div>

          {!latest ? (
            <p className="small">No posts yet.</p>
          ) : (
            <div className="grid" style={{ marginTop: 14 }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>
                  <a href={`/blog/${latest.slug}`}>{latest.title}</a>
                </h3>
                <div className="small">{latest.date}</div>
                <p>{latest.excerpt}</p>
                <a className="btn btnLink" href={`/blog/${latest.slug}`}>
                  Read more <span aria-hidden="true">→</span>
                </a>
              </div>

              {/* Keep a small list of other posts for discovery */}
              <div className="card">
                <h3 style={{ marginTop: 0 }}>More posts</h3>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {posts.slice(0, 5).map((p) => (
                    <li key={p.slug} style={{ marginBottom: 8 }}>
                      <a href={`/blog/${p.slug}`}>{p.title}</a>
                      <div className="small">{p.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
