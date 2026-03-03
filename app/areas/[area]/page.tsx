import type { Metadata } from "next";
import { getAllAreas, resolveAreaSlug, schoolsInArea } from "../../../lib/taxonomy";
import { bannerForAreaName } from "../../../lib/banners";
import JsonLd from "../../../components/JsonLd";
import { recommendGuides } from "../../../lib/posts";
import { sortSchoolsForMarketplace } from "../../../lib/sort";
import { slugify } from "../../../lib/slug";
import { getAreaComparisonPairs } from "../../../lib/areaComparisons";
import { topBudgetsFromSchools, topCurriculumTagsFromSchools, topTypesFromSchools } from "../../../lib/aggregate";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { area: string }[] {
  return getAllAreas().map((a) => ({ area: a.slug }));
}

export function generateMetadata({ params }: { params: { area: string } }): Metadata {
  const name = resolveAreaSlug(params.area) ?? params.area;
  const title = `Schools in ${name}`;
  const description = `Browse schools in ${name}, Bali. Compare curriculum, ages, and fees, then contact schools for the latest availability.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/areas/${params.area}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/areas/${params.area}`,
      images: [{ url: `${SITE_URL}${bannerForAreaName(name)}` }],
    },
  };
}

function formatIdr(n: number) {
  try {
    return new Intl.NumberFormat("id-ID").format(n);
  } catch {
    return String(n);
  }
}

export default function AreaDetailPage({ params }: { params: { area: string } }) {
  const areaName = resolveAreaSlug(params.area);
  if (!areaName) return <div className="container">Not found</div>;

  const schools = sortSchoolsForMarketplace(schoolsInArea(areaName));
  const banner = bannerForAreaName(areaName);
  const guides = recommendGuides({ area: areaName, limit: 3 });

  const feeMins = schools.map((s) => s.fees?.min).filter((n): n is number => typeof n === "number");
  const feeMaxs = schools.map((s) => s.fees?.max).filter((n): n is number => typeof n === "number");
  const minFee = feeMins.length ? Math.min(...feeMins) : null;
  const maxFee = feeMaxs.length ? Math.max(...feeMaxs) : null;

  const topCurriculums = topCurriculumTagsFromSchools(schools, 8);
  const topTypes = topTypesFromSchools(schools, 6);
  const topBudgets = topBudgetsFromSchools(schools, 4);

  const comparePairs = getAreaComparisonPairs().filter((p) => p.a === areaName || p.b === areaName);

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Areas", item: `${SITE_URL}/areas` },
    { name: areaName, item: `${SITE_URL}/areas/${params.area}` },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: c.name,
      item: c.item,
    })),
  };

  const faqItems = [
    {
      q: `Which schools are in ${areaName}?`,
      a: `This page lists schools tagged in ${areaName}. Open a school profile to check ages, curriculum, and the most recent admissions notes.`,
    },
    {
      q: `What fee range is common in ${areaName}?`,
      a: minFee && maxFee ? `Listed fee ranges in this area run from about Rp ${formatIdr(minFee)} to Rp ${formatIdr(maxFee)} per year, depending on program and age level.` : `Fees vary by school and grade level. Open individual profiles and confirm the latest fee table with admissions.`,
    },
    {
      q: `How should we shortlist schools in ${areaName}?`,
      a: `Start with commute time, then filter by curriculum and age range. After that, compare total first-year costs (tuition plus one-time fees).`,
    },
    {
      q: `Can we visit or do a trial day?`,
      a: `Many schools offer a campus tour and some offer trial days. Ask what your child can join and whether there is a trial fee.`,
    },
    {
      q: `What should we confirm before enrolling?`,
      a: `Confirm start dates, language support, class sizes, and what fees include (registration, uniforms, transport, meals, exams).`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: schools.slice(0, 200).map((s, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/schools/${s.id}`,
      name: s.name,
    })),
  };

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/areas">Areas</a>
        <span aria-hidden="true">/</span>
        <span>{areaName}</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>Schools in {areaName}</h1>
            <p className="small" style={{ marginTop: 6 }}>
              {schools.length} {schools.length === 1 ? "school" : "schools"} listed.
              {minFee && maxFee ? ` Fee ranges here span roughly Rp ${formatIdr(minFee)}–Rp ${formatIdr(maxFee)} /year.` : ""}
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src={banner} alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Browse within {areaName}</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Use these links to narrow down without creating lots of filter URLs.
          </p>

          {topCurriculums.length ? (
            <>
              <div className="small" style={{ marginTop: 10 }}>
                <strong>Curriculums</strong>
              </div>
              <div className="tagRow" style={{ marginTop: 8 }}>
                {topCurriculums.map((t) => (
                  <a key={t.slug} className="tag" href={`/curriculums/${t.slug}`}>
                    {t.name} ({t.count})
                  </a>
                ))}
              </div>
            </>
          ) : null}

          {topTypes.length ? (
            <>
              <div className="small" style={{ marginTop: 12 }}>
                <strong>Types</strong>
              </div>
              <div className="tagRow" style={{ marginTop: 8 }}>
                {topTypes.map((t) => (
                  <a key={t.slug} className="tag" href={`/types/${t.slug}`}>
                    {t.name} ({t.count})
                  </a>
                ))}
              </div>
            </>
          ) : null}

          {topBudgets.length ? (
            <>
              <div className="small" style={{ marginTop: 12 }}>
                <strong>Budget bands</strong>
              </div>
              <div className="tagRow" style={{ marginTop: 8 }}>
                {topBudgets.map((b) => (
                  <a key={b.slug} className="tag" href={`/budget/${b.slug}`}>
                    {b.name} ({b.count})
                  </a>
                ))}
              </div>
            </>
          ) : null}

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href="/schools">
              Open directory
            </a>
            <a className="btn" href="/fees">
              Fees overview
            </a>
            <a className="btn" href="/compare">
              Compare schools
            </a>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Compare areas</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Families often cross-shop nearby areas. These pages compare practical trade-offs like commute and school mix.
          </p>

          {comparePairs.length ? (
            <div className="tagRow" style={{ marginTop: 8 }}>
              {comparePairs.map((p) => {
                const other = p.a === areaName ? p.b : p.a;
                return (
                  <a key={p.slug} className="tag" href={`/compare/areas/${p.slug}`}>
                    {areaName} vs {other}
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              More comparisons will be added as we publish them.
            </p>
          )}

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href="/compare/areas">
              Browse comparisons
            </a>
            <a className="btn" href="/contact">
              Get guidance
            </a>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        {schools.map((s) => {
          const schoolImg = `/img/schools/${s.id}.webp`;
          return (
            <a key={s.id} className="card schoolCard" href={`/schools/${s.id}`}>
              <div className="schoolCardMedia" aria-hidden="true">
                <img src={schoolImg} alt="" loading="lazy" />
              </div>
              <div className="schoolCardBody">
                <div className="schoolCardTitle">
                  {s.name}
                  {s.verification?.status === "verified" ? <span className="pill">Verified</span> : null}
                  {s.sponsorship?.sponsored ? <span className="pill pillSponsored">Sponsored</span> : null}
                </div>
                <div className="small">
                  {s.type ? `${s.type} · ` : ""}
                  {s.age_min != null && s.age_max != null ? `Ages ${s.age_min}–${s.age_max}` : ""}
                </div>
                <div className="small" style={{ marginTop: 6 }}>
                  {s.fees?.display ?? "Fees: contact school"}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {guides.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="sectionHead">
            <h2 style={{ margin: 0 }}>Recommended guides</h2>
            <a className="sectionLink" href="/blog">
              View all guides
            </a>
          </div>
          <div className="grid" style={{ marginTop: 14 }}>
            {guides.map((g) => (
              <div key={g.slug} className="card soft">
                <h3 style={{ marginTop: 0 }}>
                  <a href={`/blog/${g.slug}`}>{g.title}</a>
                </h3>
                <div className="small">{g.excerpt}</div>
                <a className="btn btnLink" href={`/blog/${g.slug}`}>
                  Read <span aria-hidden="true">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>FAQ</h2>
        <div className="faqList">
          {faqItems.map((f) => (
            <details key={f.q} className="faqItem">
              <summary>{f.q}</summary>
              <div className="faqAnswer">
                <p style={{ marginTop: 0 }}>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
    </div>
  );
}
