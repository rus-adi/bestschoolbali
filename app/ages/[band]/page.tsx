import type { Metadata } from "next";
import { AGE_BANDS, resolveAgeBandSlug, schoolsInAgeBandSlug } from "../../../lib/ages";
import { slugify } from "../../../lib/slug";
import JsonLd from "../../../components/JsonLd";
import { recommendGuides } from "../../../lib/posts";
import { sortSchoolsForMarketplace } from "../../../lib/sort";
import { topAreasFromSchools, topBudgetsFromSchools, topCurriculumTagsFromSchools, topTypesFromSchools } from "../../../lib/aggregate";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { band: string }[] {
  return AGE_BANDS.map((b) => ({ band: b.slug }));
}

export function generateMetadata({ params }: { params: { band: string } }): Metadata {
  const band = resolveAgeBandSlug(params.band);
  const name = band?.name ?? params.band;

  const title = `${name} schools in Bali`;
  const description = `Browse Bali schools that cover ${name.toLowerCase()} ages. Compare areas, curriculum tags, and annual fee ranges, then confirm placement with admissions.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ages/${params.band}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/ages/${params.band}`,
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

export default function AgeBandPage({ params }: { params: { band: string } }) {
  const band = resolveAgeBandSlug(params.band);
  if (!band) return <div className="container">Not found</div>;

  const schools = sortSchoolsForMarketplace(schoolsInAgeBandSlug(params.band));
  const guides = recommendGuides({ limit: 3 });

  const feeMins = schools.map((s) => s.fees?.min).filter((n): n is number => typeof n === "number");
  const feeMaxs = schools.map((s) => s.fees?.max).filter((n): n is number => typeof n === "number");
  const minFee = feeMins.length ? Math.min(...feeMins) : null;
  const maxFee = feeMaxs.length ? Math.max(...feeMaxs) : null;

  const topAreas = topAreasFromSchools(schools, 6);
  const topCurriculums = topCurriculumTagsFromSchools(schools, 8);
  const topBudgets = topBudgetsFromSchools(schools, 4);
  const topTypes = topTypesFromSchools(schools, 6);

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Ages", item: `${SITE_URL}/ages` },
    { name: band.name, item: `${SITE_URL}/ages/${band.slug}` },
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
      q: `Which schools cover ${band.name.toLowerCase()} ages?`,
      a: `This page lists schools whose published age range overlaps roughly ${band.min}–${band.max}. Confirm exact year levels, start dates, and placement with admissions.`,
    },
    {
      q: "Do schools accept mid-year transfers?",
      a: "Some schools accept transfers mid-year, others prefer term starts. Ask about space in your target grade and whether assessments are required.",
    },
    {
      q: "What should we confirm for placement?",
      a: "Confirm the child’s current grade, language level, and learning support needs. Ask how the school places new students and what documentation is needed.",
    },
    {
      q: "What fees should we compare for this age band?",
      a: "Ask for the total first-year cost: tuition plus registration, materials, uniforms, transport, meals, and any program fees that apply to this age group.",
    },
    {
      q: "How do we shortlist efficiently?",
      a: "Pick a realistic commute, then shortlist 3–5 schools. Book tours close together and use the same question list so you can compare fairly.",
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
        <a href="/ages">Ages</a>
        <span aria-hidden="true">/</span>
        <span>{band.name}</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>{band.name} schools in Bali</h1>
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
          <h2 style={{ marginTop: 0 }}>Shortlist tips</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>Start with area/commute, then narrow by curriculum.</li>
            <li>Ask about language support and how placement is handled.</li>
            <li>Compare the total first-year cost, not only tuition.</li>
          </ul>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Need help?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Share your area, your child’s age, and any curriculum preference — we’ll help you build a shortlist and draft the
            questions to send to admissions.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/schools">
              Browse all schools
            </a>
            <a className="btn" href="/fees">
              Fees overview
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
          <h2 style={{ marginTop: 0 }}>Budget bands</h2>
          {topBudgets.length ? (
            <div className="tagRow" style={{ marginTop: 0 }}>
              {topBudgets.map((b) => (
                <a key={b.slug} className="tag" href={`/budget/${b.slug}`}>
                  {b.name} ({b.count})
                </a>
              ))}
            </div>
          ) : (
            <p className="small" style={{ marginTop: 0 }}>
              Budget bands aren’t available for these listings.
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
                <strong>Fees:</strong> {s.fees?.display ?? "Contact school"}
                {s.fees?.status === "estimate" ? <span className="pill">Estimate</span> : null}
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