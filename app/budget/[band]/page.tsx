import type { Metadata } from "next";
import { getAllBudgets, resolveBudgetSlug, schoolsInBudgetSlug } from "../../../lib/taxonomy";
import { slugify } from "../../../lib/slug";
import JsonLd from "../../../components/JsonLd";
import { recommendGuides } from "../../../lib/posts";
import { sortSchoolsForMarketplace } from "../../../lib/sort";
import { topAreasFromSchools, topCurriculumTagsFromSchools, topTypesFromSchools } from "../../../lib/aggregate";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { band: string }[] {
  return getAllBudgets().map((b) => ({ band: b.slug }));
}

export function generateMetadata({ params }: { params: { band: string } }): Metadata {
  const name = resolveBudgetSlug(params.band) ?? params.band;
  const title = `${name} schools in Bali`;
  const description = `Browse Bali schools in the ${name} budget band. Compare areas, curriculum tags, ages, and annual fee ranges, then confirm the latest total cost with admissions.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/budget/${params.band}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/budget/${params.band}`,
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

export default function BudgetBandPage({ params }: { params: { band: string } }) {
  const bandName = resolveBudgetSlug(params.band);
  if (!bandName) return <div className="container">Not found</div>;

  const schools = sortSchoolsForMarketplace(schoolsInBudgetSlug(params.band));
  const guides = recommendGuides({ budget: bandName, limit: 3 });

  const feeMins = schools.map((s) => s.fees?.min).filter((n): n is number => typeof n === "number");
  const feeMaxs = schools.map((s) => s.fees?.max).filter((n): n is number => typeof n === "number");
  const minFee = feeMins.length ? Math.min(...feeMins) : null;
  const maxFee = feeMaxs.length ? Math.max(...feeMaxs) : null;

  const topAreas = topAreasFromSchools(schools, 6);
  const topCurriculums = topCurriculumTagsFromSchools(schools, 8);
  const topTypes = topTypesFromSchools(schools, 6);

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Budget", item: `${SITE_URL}/budget` },
    { name: bandName, item: `${SITE_URL}/budget/${params.band}` },
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
      q: `What does the “${bandName}” band mean?`,
      a: "It’s a simple grouping based on annual tuition ranges. Exact fees vary by grade level and what’s included, so always request the current fee sheet from admissions.",
    },
    {
      q: "What costs are usually not included in tuition?",
      a: "Often: registration fees, uniforms, transport, meals, exams, some extracurriculars, learning materials, and capital levies. Ask for a full first‑year total.",
    },
    {
      q: "How do we shortlist within a budget band?",
      a: "Start with area (commute), confirm age/grade coverage, then compare curriculum and support needs. After that, ask each school for a breakdown of one‑time fees and monthly/annual extras.",
    },
    {
      q: "Do schools offer sibling discounts or payment plans?",
      a: "Some do. Ask whether there are sibling discounts, term-by-term payment options, and what happens if you start mid‑term.",
    },
    {
      q: "How often do fees change?",
      a: "Schools can update fees each academic year and sometimes mid-year. Use this directory as a starting point and confirm details before enrolling.",
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
        <a href="/budget">Budget</a>
        <span aria-hidden="true">/</span>
        <span>{bandName}</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>{bandName} schools in Bali</h1>
            <p className="small" style={{ marginTop: 6 }}>
              {schools.length} {schools.length === 1 ? "school" : "schools"} listed.
              {minFee && maxFee ? ` Typical annual ranges span roughly Rp ${formatIdr(minFee)}–Rp ${formatIdr(maxFee)}.` : ""}
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>How to use this page</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>Use budget as a quick filter — then verify the full first-year cost with admissions.</li>
            <li>Shortlist by commute and age range first; curriculum and support needs come next.</li>
            <li>If fees are estimates, request a fee sheet before booking a long commute tour.</li>
          </ul>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Next steps</h2>
          <p className="small" style={{ marginTop: 0 }}>
            If you want, tell us your area, child’s age, and preferred curriculum — we’ll help you shortlist and draft the
            exact questions to ask.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/fees">
              Fees overview
            </a>
            <a className="btn" href="/schools">
              Browse all schools
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Common areas</h2>
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
              Area tags aren’t available for these listings.
            </p>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Common curriculum tags</h2>
          {topCurriculums.length ? (
            <div className="tagRow" style={{ marginTop: 0 }}>
              {topCurriculums.map((t) => (
                <a key={t.slug} className="tag" href={`/curriculums/${t.slug}`}>
                  {t.name} ({t.count})
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Curriculum tags aren’t listed for these schools.
            </p>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Common types</h2>
          {topTypes.length ? (
            <div className="tagRow" style={{ marginTop: 0 }}>
              {topTypes.map((t) => (
                <a key={t.slug} className="tag" href={`/types/${t.slug}`}>
                  {t.name} ({t.count})
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Types aren’t listed for these schools.
            </p>
          )}
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
                {s.type ? ` · ${s.type}` : ""}
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
      <JsonLd data={faqJsonLd} />
      <JsonLd data={itemListJsonLd} />
    </div>
  );
}