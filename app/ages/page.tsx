import type { Metadata } from "next";
import { getAllAgeBands } from "../../lib/ages";
import JsonLd from "../../components/JsonLd";

export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export const metadata: Metadata = {
  title: "Browse by age",
  description:
    "Browse Bali schools by age band. Use this as a starting point, then confirm exact grade coverage and placement with admissions.",
  alternates: { canonical: `${SITE_URL}/ages` },
  openGraph: {
    title: "Browse schools by age",
    description:
      "Explore Bali schools by age band (early years, primary, secondary) and jump into profiles to compare curriculum, fees, and admissions notes.",
    url: `${SITE_URL}/ages`,
    images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
  },
};

export default function AgesIndexPage() {
  const bands = getAllAgeBands();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ages", item: `${SITE_URL}/ages` },
    ],
  };

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <span>Ages</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>Browse by age</h1>
            <p className="small" style={{ marginTop: 6 }}>
              These age bands are a simple shortcut. Always confirm grade/year coverage and placement with admissions.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        {bands.map((b) => (
          <a key={b.slug} className="card" href={`/ages/${b.slug}`}>
            <h2 style={{ marginTop: 0 }}>{b.name}</h2>
            <p className="small" style={{ marginTop: 0 }}>
              {b.description}
            </p>
            <div className="small">
              <strong>{b.count}</strong> {b.count === 1 ? "school" : "schools"} listed
            </div>
            <div className="inlineLinks" style={{ marginTop: 10 }}>
              <span className="btn btnLink">
                View schools <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Next step: compare properly</h2>
          <p className="small" style={{ marginTop: 0 }}>
            After you pick an age band, narrow by area (commute) and curriculum. Then compare the full first-year cost — not
            just tuition.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/schools">
              Browse directory
            </a>
            <a className="btn" href="/fees">
              Fees overview
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Want a side‑by‑side view?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Use the compare tool to look at a few schools at once. It’s a quick way to sanity‑check fees, ages, and
            curriculum tags.
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
