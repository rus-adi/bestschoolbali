import type { Metadata } from "next";
import { getAllTypes } from "../../lib/taxonomy";
import JsonLd from "../../components/JsonLd";

export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export const metadata: Metadata = {
  title: "School types in Bali",
  description:
    "Browse Bali schools by type (international, bilingual, Montessori, and more). Open profiles to compare curriculum, ages, and fees.",
  alternates: { canonical: `${SITE_URL}/types` },
  openGraph: {
    title: "School types in Bali",
    description: "Browse Bali schools by type and open profiles to compare curriculum, ages, and fees.",
    url: `${SITE_URL}/types`,
    images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
  },
};

export default function TypesIndexPage() {
  const types = getAllTypes();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Types", item: `${SITE_URL}/types` },
    ],
  };

  const faqItems = [
    {
      q: "What does a school type mean?",
      a: "Type labels are a simple browsing shortcut. Schools sometimes use different wording, so always open a profile and confirm the exact program, language of instruction, and age/grade coverage.",
    },
    {
      q: "Is ‘international school’ always the best option?",
      a: "Not necessarily. Many families prioritize commute, community fit, and support. Use type as a starting point, then shortlist based on age range, curriculum pathway, and total first‑year cost.",
    },
    {
      q: "How should we shortlist schools after choosing a type?",
      a: "Pick your area first (traffic matters), then confirm ages/grade levels and curriculum. Finally, compare fees by asking for the full first‑year total (tuition + one‑time fees + recurring extras).",
    },
    {
      q: "Can you help us choose?",
      a: "Yes. If you share your area, child’s age, and a couple of priorities (curriculum, budget, language support), we’ll suggest a shortlist and the exact questions to send to admissions.",
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

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <span>Types</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>School types</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Browse schools by type, then open profiles to confirm curriculum, ages, and fees.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        {types.map((t) => (
          <div key={t.slug} className="card">
            <h3 style={{ marginTop: 0 }}>
              <a href={`/types/${t.slug}`}>{t.name}</a>
            </h3>
            <div className="small">{t.count} schools</div>
            <div className="inlineLinks" style={{ marginTop: 10 }}>
              <a className="btn btnLink" href={`/types/${t.slug}`}>
                Browse <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Combine type with area</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Type helps you narrow quickly, but commute is often the deciding factor. Pick an area first, then check type.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/areas">
              Browse areas
            </a>
            <a className="btn" href="/schools">
              Open directory
            </a>
          </div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Fees & budget</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Compare schools using total first‑year cost. Budget bands are the fastest way to filter early.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/budget">
              Budget bands
            </a>
            <a className="btn" href="/fees">
              Fees overview
            </a>
          </div>
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
