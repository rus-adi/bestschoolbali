import type { Metadata } from "next";
import { getAreaComparisonPairs, resolveAreaPairSlug, areaThumbFor } from "../../../../lib/areaComparisons";
import { slugify } from "../../../../lib/slug";
import { schoolsInArea } from "../../../../lib/taxonomy";
import JsonLd from "../../../../components/JsonLd";
import { sortSchoolsForMarketplace } from "../../../../lib/sort";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { pair: string }[] {
  return getAreaComparisonPairs().map((p) => ({ pair: p.slug }));
}

export function generateMetadata({ params }: { params: { pair: string } }): Metadata {
  const pair = resolveAreaPairSlug(params.pair);
  const a = pair?.a ?? "";
  const b = pair?.b ?? "";

  const title = pair ? `${a} vs ${b}: Schools & family commute` : "Area comparison";
  const description = pair
    ? `A school-focused comparison of ${a} vs ${b}: commute patterns, school mix, and a quick fee-range snapshot.`
    : "A school-focused comparison of popular Bali areas.";

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/compare/areas/${params.pair}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/compare/areas/${params.pair}`,
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

function feeSnapshot(schools: Array<{ fees?: { min?: number; max?: number } }>) {
  const mins = schools.map((s) => s.fees?.min).filter((n): n is number => typeof n === "number");
  const maxs = schools.map((s) => s.fees?.max).filter((n): n is number => typeof n === "number");
  if (!mins.length || !maxs.length) return null;
  return { min: Math.min(...mins), max: Math.max(...maxs) };
}

function topTags(schools: Array<{ curriculum_tags?: string[] }>, limit = 5) {
  const counts = new Map<string, number>();
  for (const s of schools) {
    for (const t of s.curriculum_tags ?? []) {
      const tag = String(t || "").trim();
      if (!tag) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function topTypes(schools: Array<{ type?: string }>, limit = 4) {
  const counts = new Map<string, number>();
  for (const s of schools) {
    const t = String(s.type ?? "").trim();
    if (!t) continue;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([t]) => t);
}

export default function AreaComparePage({ params }: { params: { pair: string } }) {
  const pair = resolveAreaPairSlug(params.pair);
  if (!pair) return <div className="container">Not found</div>;

  const aSchools = sortSchoolsForMarketplace(schoolsInArea(pair.a));
  const bSchools = sortSchoolsForMarketplace(schoolsInArea(pair.b));

  const aFee = feeSnapshot(aSchools);
  const bFee = feeSnapshot(bSchools);

  const aTagTop = topTags(aSchools, 5);
  const bTagTop = topTags(bSchools, 5);

  const aTypeTop = topTypes(aSchools, 4);
  const bTypeTop = topTypes(bSchools, 4);

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Compare", item: `${SITE_URL}/compare` },
    { name: "Areas", item: `${SITE_URL}/compare/areas` },
    { name: `${pair.a} vs ${pair.b}`, item: `${SITE_URL}/compare/areas/${pair.slug}` },
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
      q: `Is ${pair.a} or ${pair.b} better for schools?`,
      a: "It depends on commute, your child’s age, and curriculum preference. Use this page to shortlist, then confirm availability and the latest fees with admissions.",
    },
    {
      q: "How should we test commute time?",
      a: "If possible, do a trial drive at drop‑off and pick‑up times. A route that looks short on a map can feel very different in school traffic.",
    },
    {
      q: "What should we compare besides tuition?",
      a: "Compare total first‑year cost (tuition + one‑time fees + recurring extras), language support, year levels offered, and how placement is handled for new students.",
    },
    {
      q: "Can you help us shortlist?",
      a: "Yes — share your area preference, child’s age, and any curriculum needs. We’ll suggest a shortlist and a short question list to send to admissions.",
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

  const aSlug = slugify(pair.a);
  const bSlug = slugify(pair.b);

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/compare">Compare</a>
        <span aria-hidden="true">/</span>
        <a href="/compare/areas">Areas</a>
        <span aria-hidden="true">/</span>
        <span>
          {pair.a} vs {pair.b}
        </span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>
              {pair.a} vs {pair.b}
            </h1>
            <p className="small" style={{ marginTop: 6 }}>
              A school‑first comparison: commute, school mix, and a quick fee snapshot.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="compareAreaHead">
            <img src={areaThumbFor(pair.a)} alt="" aria-hidden="true" />
            <div>
              <h2 style={{ marginTop: 0 }}>{pair.a}</h2>
              <p className="small" style={{ marginTop: 0 }}>
                {aSchools.length} {aSchools.length === 1 ? "school" : "schools"} listed.
                {aFee ? ` Fee ranges roughly Rp ${formatIdr(aFee.min)}–Rp ${formatIdr(aFee.max)} /year.` : ""}
              </p>
            </div>
          </div>

          <div className="compareStatRow">
            <div>
              <div className="small muted">Common school types</div>
              <div>{aTypeTop.length ? aTypeTop.join(", ") : "—"}</div>
            </div>
            <div>
              <div className="small muted">Top curriculum tags</div>
              <div>{aTagTop.length ? aTagTop.join(", ") : "—"}</div>
            </div>
          </div>

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href={`/areas/${aSlug}`}>
              View {pair.a} area page
            </a>
            <a className="btn" href="#schools-a">
              See schools
            </a>
          </div>
        </div>

        <div className="card">
          <div className="compareAreaHead">
            <img src={areaThumbFor(pair.b)} alt="" aria-hidden="true" />
            <div>
              <h2 style={{ marginTop: 0 }}>{pair.b}</h2>
              <p className="small" style={{ marginTop: 0 }}>
                {bSchools.length} {bSchools.length === 1 ? "school" : "schools"} listed.
                {bFee ? ` Fee ranges roughly Rp ${formatIdr(bFee.min)}–Rp ${formatIdr(bFee.max)} /year.` : ""}
              </p>
            </div>
          </div>

          <div className="compareStatRow">
            <div>
              <div className="small muted">Common school types</div>
              <div>{bTypeTop.length ? bTypeTop.join(", ") : "—"}</div>
            </div>
            <div>
              <div className="small muted">Top curriculum tags</div>
              <div>{bTagTop.length ? bTagTop.join(", ") : "—"}</div>
            </div>
          </div>

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href={`/areas/${bSlug}`}>
              View {pair.b} area page
            </a>
            <a className="btn" href="#schools-b">
              See schools
            </a>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>How to decide</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>
              <strong>Commute first.</strong> Test drop‑off and pick‑up routes before scheduling a week of tours.
            </li>
            <li>
              <strong>Shortlist 3–5 schools.</strong> Book tours close together so you can compare consistently.
            </li>
            <li>
              <strong>Compare total cost.</strong> Ask for tuition + one‑time fees + recurring extras.
            </li>
          </ul>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Need a shortlist?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Share your child’s age, your preferred curriculum, and which of these two areas you’re leaning toward.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/compare">
              Compare schools
            </a>
            <a className="btn" href="/schools">
              Browse directory
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card" id="schools-a">
          <h2 style={{ marginTop: 0 }}>Schools in {pair.a}</h2>
          <div className="grid" style={{ marginTop: 14 }}>
            {aSchools.slice(0, 12).map((s) => (
              <a key={s.id} className="card schoolCard" href={`/schools/${s.id}`}>
                <div className="schoolCardMedia" aria-hidden="true">
                  <img src={`/img/schools/${s.id}.webp`} alt="" loading="lazy" />
                </div>
                <div className="schoolCardBody">
                  <div className="schoolCardTitle">{s.name}{s.verification?.status === "verified" ? <span className="pill">Verified</span> : null}{s.sponsorship?.sponsored ? <span className="pill pillSponsored">Sponsored</span> : null}</div>
                  <div className="small">{s.type ?? ""}</div>
                  <div className="small" style={{ marginTop: 6 }}>
                    {s.fees?.display ?? "Fees: contact school"}
                  </div>
                </div>
              </a>
            ))}
          </div>
          {aSchools.length > 12 ? (
            <p className="small" style={{ marginTop: 12, marginBottom: 0 }}>
              Showing 12 of {aSchools.length}. See the full list on the <a href={`/areas/${aSlug}`}>{pair.a} area page</a>.
            </p>
          ) : null}
        </div>

        <div className="card" id="schools-b">
          <h2 style={{ marginTop: 0 }}>Schools in {pair.b}</h2>
          <div className="grid" style={{ marginTop: 14 }}>
            {bSchools.slice(0, 12).map((s) => (
              <a key={s.id} className="card schoolCard" href={`/schools/${s.id}`}>
                <div className="schoolCardMedia" aria-hidden="true">
                  <img src={`/img/schools/${s.id}.webp`} alt="" loading="lazy" />
                </div>
                <div className="schoolCardBody">
                  <div className="schoolCardTitle">{s.name}{s.verification?.status === "verified" ? <span className="pill">Verified</span> : null}{s.sponsorship?.sponsored ? <span className="pill pillSponsored">Sponsored</span> : null}</div>
                  <div className="small">{s.type ?? ""}</div>
                  <div className="small" style={{ marginTop: 6 }}>
                    {s.fees?.display ?? "Fees: contact school"}
                  </div>
                </div>
              </a>
            ))}
          </div>
          {bSchools.length > 12 ? (
            <p className="small" style={{ marginTop: 12, marginBottom: 0 }}>
              Showing 12 of {bSchools.length}. See the full list on the <a href={`/areas/${bSlug}`}>{pair.b} area page</a>.
            </p>
          ) : null}
        </div>
      </div>

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
    </div>
  );
}
