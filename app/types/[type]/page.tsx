import type { Metadata } from "next";
import { getAllTypes, resolveTypeSlug, schoolsInTypeSlug } from "../../../lib/taxonomy";
import { slugify } from "../../../lib/slug";
import JsonLd from "../../../components/JsonLd";
import { recommendGuides } from "../../../lib/posts";
import { sortSchoolsForMarketplace } from "../../../lib/sort";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { type: string }[] {
  return getAllTypes().map((t) => ({ type: t.slug }));
}

export function generateMetadata({ params }: { params: { type: string } }): Metadata {
  const name = resolveTypeSlug(params.type) ?? params.type;
  const title = `${name} schools in Bali`;
  const description = `Browse ${name.toLowerCase()} options in Bali. Compare areas, ages, curriculum tags, and fee ranges, then open school profiles for admissions notes.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/types/${params.type}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/types/${params.type}`,
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

function topCounts(items: string[], limit = 6): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const raw of items) {
    const v = String(raw ?? "").trim();
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export default function TypeDetailPage({ params }: { params: { type: string } }) {
  const typeName = resolveTypeSlug(params.type);
  if (!typeName) return <div className="container">Not found</div>;

  const schools = sortSchoolsForMarketplace(schoolsInTypeSlug(params.type));

  const feeMins = schools.map((s) => s.fees?.min).filter((n): n is number => typeof n === "number");
  const feeMaxs = schools.map((s) => s.fees?.max).filter((n): n is number => typeof n === "number");
  const minFee = feeMins.length ? Math.min(...feeMins) : null;
  const maxFee = feeMaxs.length ? Math.max(...feeMaxs) : null;

  const agesMin = schools.map((s) => s.age_min).filter((n): n is number => typeof n === "number");
  const agesMax = schools.map((s) => s.age_max).filter((n): n is number => typeof n === "number");
  const minAge = agesMin.length ? Math.min(...agesMin) : null;
  const maxAge = agesMax.length ? Math.max(...agesMax) : null;

  const topAreas = topCounts(schools.map((s) => s.area), 6);
  const topCurriculums = topCounts(schools.flatMap((s) => s.curriculum_tags ?? []), 8);
  const topBudgets = topCounts(schools.map((s) => s.budget_category ?? ""), 3);

  const guides = recommendGuides({
    curriculumTags: topCurriculums.map((t) => t.name).slice(0, 3),
    budget: topBudgets[0]?.name,
    limit: 3,
  });

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Types", item: `${SITE_URL}/types` },
    { name: typeName, item: `${SITE_URL}/types/${params.type}` },
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
      q: `What does “${typeName}” mean in Bali?`,
      a: "Type labels are a browsing shortcut. Schools sometimes use different wording, so confirm the curriculum, language of instruction, and grade coverage directly with admissions.",
    },
    {
      q: `How do we shortlist ${typeName.toLowerCase()} options?`,
      a: "Start with commute/area, then confirm ages/grades and curriculum pathway. After that, compare total first-year cost (tuition + one-time fees + recurring extras).",
    },
    {
      q: "Do fees vary a lot within the same type?",
      a: "Yes. Fees can vary significantly by campus, facilities, and age level. Use the fee range shown on each school profile as a starting point and request the latest fee sheet.",
    },
    {
      q: "Can we combine type with curriculum and budget filters?",
      a: "Yes. Use this type page for browsing, then switch to the directory if you want to filter by multiple criteria (area + curriculum + budget).",
    },
    {
      q: "Can you help us choose between a few schools?",
      a: "Yes. Share your area, child’s age, and a couple of priorities and we’ll help you shortlist and draft the admissions questions to send.",
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
        <a href="/types">Types</a>
        <span aria-hidden="true">/</span>
        <span>{typeName}</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>{typeName} schools in Bali</h1>
            <p className="small" style={{ marginTop: 6 }}>
              {schools.length} {schools.length === 1 ? "school" : "schools"} listed.
              {minFee && maxFee ? ` Typical annual ranges span roughly Rp ${formatIdr(minFee)}–Rp ${formatIdr(maxFee)}.` : ""}
              {minAge != null && maxAge != null ? ` Ages span about ${minAge}–${maxAge}.` : ""}
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Where you’ll find these schools</h2>
          {topAreas.length ? (
            <div className="tagRow" style={{ marginTop: 0 }}>
              {topAreas.map((a) => (
                <a key={a.name} className="tag" href={`/areas/${slugify(a.name)}`}>
                  {a.name} ({a.count})
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Area tags aren’t available for these listings.
            </p>
          )}
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Common curriculum tags</h2>
          {topCurriculums.length ? (
            <div className="tagRow" style={{ marginTop: 0 }}>
              {topCurriculums.slice(0, 8).map((t) => (
                <a key={t.name} className="tag" href={`/curriculums/${slugify(t.name)}`}>
                  {t.name}
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Curriculum tags aren’t listed for these schools.
            </p>
          )}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Budget bands</h2>
          {topBudgets.length ? (
            <div className="tagRow" style={{ marginTop: 0 }}>
              {topBudgets.map((b) => (
                <a key={b.name} className="tag" href={`/budget/${slugify(b.name)}`}>
                  {b.name} ({b.count})
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Budget bands aren’t available for these listings.
            </p>
          )}

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href="/budget">
              Browse budget
            </a>
            <a className="btn" href="/fees">
              Fees overview
            </a>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Next steps</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Once you’ve shortlisted by commute and age range, open 3–5 profiles and compare the full first-year cost.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/schools">
              Open directory
            </a>
            <a className="btn" href="/compare">
              Compare schools
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      </div>


      <div className="grid" style={{ marginTop: 16 }}>
        {schools.map((s) => (
          <a key={s.id} className="card schoolCard" href={`/schools/${s.id}`}>
            <div className="schoolCardMedia" aria-hidden="true">
              <img src={`/img/schools/${s.id}.webp`} alt="" loading="lazy" />
            </div>
            <div className="schoolCardBody">
              <div className="schoolCardTitle">{s.name}{s.verification?.status === "verified" ? <span className="pill">Verified</span> : null}{s.sponsorship?.sponsored ? <span className="pill pillSponsored">Sponsored</span> : null}</div>
              <div className="small">
                <a href={`/areas/${slugify(s.area)}`}>{s.area}</a>
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

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Want to filter further?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Use the directory to combine area + curriculum + budget filters.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/schools">
              Open directory
            </a>
            <a className="btn" href="/areas">
              Areas
            </a>
            <a className="btn" href="/curriculums">
              Curriculums
            </a>
          </div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Need a shortlist?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Tell us your child’s age, your area, and a rough budget. We’ll suggest a shortlist and a question list for tours.
          </p>
          <a className="btn btnPrimary" href="/contact">
            Get free guidance <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={itemListJsonLd} />
    </div>
  );
}
