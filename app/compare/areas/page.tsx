import type { Metadata } from "next";
import { getAreaComparisonPairs, areaThumbFor } from "../../../lib/areaComparisons";
import JsonLd from "../../../components/JsonLd";

export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export const metadata: Metadata = {
  title: "Area comparisons",
  description:
    "Compare popular family areas in Bali (Canggu, Ubud, Sanur, Bukit) with a school-focused lens: commute, school types, and typical fee ranges.",
  alternates: { canonical: `${SITE_URL}/compare/areas` },
  openGraph: {
    title: "Compare areas in Bali for schools",
    description:
      "A practical, school-first comparison of popular Bali areas for families — with shortlists and FAQs.",
    url: `${SITE_URL}/compare/areas`,
    images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
  },
};

export default function AreaCompareIndexPage() {
  const pairs = getAreaComparisonPairs();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare` },
      { "@type": "ListItem", position: 3, name: "Areas", item: `${SITE_URL}/compare/areas` },
    ],
  };

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/compare">Compare</a>
        <span aria-hidden="true">/</span>
        <span>Areas</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>Area comparisons</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Short, parent-friendly comparisons focused on commute and school choice. Use these to decide where to tour.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        {pairs.map((p) => (
          <a key={p.slug} className="card schoolCard" href={`/compare/areas/${p.slug}`}>
            <div className="schoolCardMedia" aria-hidden="true">
              <img src={areaThumbFor(p.a)} alt="" loading="lazy" />
            </div>
            <div className="schoolCardBody">
              <div className="schoolCardTitle">
                {p.a} vs {p.b}
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                Compare commute patterns, typical school options, and fee ranges.
              </div>
              <div className="inlineLinks" style={{ marginTop: 10 }}>
                <span className="btn btnLink">
                  View comparison <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Tip: start with commute</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Bali traffic can be very time‑dependent. If you’re choosing between two areas, test the drop‑off and pick‑up
            commute before you commit to a long tour schedule.
          </p>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Prefer to compare schools directly?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Use the compare tool to look at fees, ages, and curriculum tags side-by-side.
          </p>
          <a className="btn btnLink" href="/compare">
            Compare schools <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <JsonLd data={breadcrumbJsonLd} />
    </div>
  );
}
