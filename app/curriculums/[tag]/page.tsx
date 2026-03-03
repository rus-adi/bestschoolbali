import type { Metadata } from "next";
import { getAllCurriculums, resolveCurriculumSlug, schoolsWithCurriculumSlug } from "../../../lib/taxonomy";
import { slugify } from "../../../lib/slug";
import JsonLd from "../../../components/JsonLd";
import { recommendGuides } from "../../../lib/posts";
import { sortSchoolsForMarketplace } from "../../../lib/sort";
import { topAreasFromSchools, topBudgetsFromSchools, topCurriculumTagsFromSchools, topTypesFromSchools } from "../../../lib/aggregate";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { tag: string }[] {
  return getAllCurriculums().map((t) => ({ tag: t.slug }));
}

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  const tagName = resolveCurriculumSlug(params.tag) ?? params.tag;
  const title = `${tagName} schools in Bali`;
  const description = `Browse schools offering ${tagName} in Bali. Compare areas, ages, and fees, and open individual profiles for admissions details.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/curriculums/${params.tag}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/curriculums/${params.tag}`,
      images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
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

export default function CurriculumDetailPage({ params }: { params: { tag: string } }) {
  const tagName = resolveCurriculumSlug(params.tag);
  if (!tagName) return <div className="container">Not found</div>;

  const schools = sortSchoolsForMarketplace(schoolsWithCurriculumSlug(params.tag));
  const guides = recommendGuides({ curriculumTags: [tagName], limit: 3 });

  const feeMins = schools.map((s) => s.fees?.min).filter((n): n is number => typeof n === "number");
  const feeMaxs = schools.map((s) => s.fees?.max).filter((n): n is number => typeof n === "number");
  const minFee = feeMins.length ? Math.min(...feeMins) : null;
  const maxFee = feeMaxs.length ? Math.max(...feeMaxs) : null;

  const topAreas = topAreasFromSchools(schools, 6);
  const topTypes = topTypesFromSchools(schools, 6);
  const topBudgets = topBudgetsFromSchools(schools, 4);

  // Helpful cross-links: show a few other common tags families explore alongside this one.
  const otherCurriculums = topCurriculumTagsFromSchools(schools, 10)
    .filter((t) => t.slug !== params.tag)
    .slice(0, 6);

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Curriculums", item: `${SITE_URL}/curriculums` },
    { name: tagName, item: `${SITE_URL}/curriculums/${params.tag}` },
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
      q: `What does “${tagName}” mean for a school in Bali?`,
      a: `Schools use curriculum labels in different ways. Open a profile and confirm the grade levels offered, the exam pathway (if any), and the language of instruction.`,
    },
    {
      q: `How do we shortlist ${tagName} schools?`,
      a: `Start with your area and commute, then confirm ages/grade levels and total first-year costs. A campus tour and a trial day (if offered) are usually the fastest way to sense fit.`,
    },
    {
      q: `Do all ${tagName} schools have the same fees?`,
      a: `No. Fees vary by campus, facilities, and age level. Use the fee range shown on each profile as a starting point and confirm the latest fee table with admissions.`,
    },
    {
      q: `Can we combine this curriculum with an area search?`,
      a: `Yes. Browse by area first, then check which schools match ${tagName}. For a tighter shortlist, pick the areas you’d actually commute from.`,
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
        <a href="/curriculums">Curriculums</a>
        <span aria-hidden="true">/</span>
        <span>{tagName}</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>{tagName} schools in Bali</h1>
            <p className="small" style={{ marginTop: 6 }}>
              {schools.length} {schools.length === 1 ? "school" : "schools"} listed.
              {minFee && maxFee ? ` Fee ranges span roughly Rp ${formatIdr(minFee)}–Rp ${formatIdr(maxFee)} /year.` : ""}
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Common areas for this curriculum</h2>
          {topAreas.length ? (
            <div className="tagRow" style={{ marginTop: 0 }}>
              {topAreas.map((a) => (
                <a key={a.slug} className="tag" href={`/areas/${a.slug}`}>
                  {a.name} ({a.count})
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Area breakdown isn’t available for these listings.
            </p>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>School types and budgets</h2>

          {topTypes.length ? (
            <>
              <div className="small" style={{ marginTop: 0 }}>
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
            <a className="btn" href="/fees">
              Fees overview
            </a>
            <a className="btn" href="/schools">
              Open directory
            </a>
            <a className="btn" href="/contact">
              Get guidance
            </a>
          </div>
        </div>
      </div>

      {otherCurriculums.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="sectionHead">
            <h2 style={{ margin: 0 }}>Often explored together</h2>
            <a className="sectionLink" href="/curriculums">
              View all curriculums
            </a>
          </div>
          <div className="tagRow" style={{ marginTop: 12 }}>
            {otherCurriculums.map((t) => (
              <a key={t.slug} className="tag" href={`/curriculums/${t.slug}`}>
                {t.name}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid" style={{ marginTop: 16 }}>
        {schools.map((s) => (
          <a key={s.id} className="card schoolCard" href={`/schools/${s.id}`}>
            <div className="schoolCardMedia" aria-hidden="true">
              <img src={`/img/schools/${s.id}.webp`} alt="" loading="lazy" />
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
                {s.age_min != null && s.age_max != null ? ` · Ages ${s.age_min}–${s.age_max}` : ""}
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                {s.fees?.display ?? "Fees: contact school"}
              </div>
            </div>
          </a>
        ))}
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