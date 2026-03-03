import type { Metadata } from "next";

export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export const metadata: Metadata = {
  title: "Listing upgrades",
  description:
    "Upgrade options for schools on Best School Bali: verified profiles, enhanced galleries, and sponsored placements (clearly labeled).",
  alternates: { canonical: `${SITE_URL}/for-schools/pricing` },
  openGraph: {
    title: "Listing upgrades | Best School Bali",
    description:
      "Verified profiles, enhanced galleries, and sponsored placements (clearly labeled).",
    url: `${SITE_URL}/for-schools/pricing`,
    images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
  },
};

export default function ForSchoolsPricingPage() {
  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/for-schools">For schools</a>
        <span aria-hidden="true">/</span>
        <span>Listing upgrades</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>Listing upgrades</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Clear, trust-first upgrades for schools. Sponsored placements are always labeled.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Free listing</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>School profile page with fees range and key facts</li>
            <li>Curriculum tags, area pages, and directory visibility</li>
            <li>Placeholder images until school-provided photos are available</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Verified profile</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Verified is designed to reduce uncertainty for families.
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>Verified badge on your listing and profile</li>
            <li>Optional “last verified” date</li>
            <li>Faster updates for fees and admissions notes</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Enhanced profile</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Best for schools that want their page to feel complete and parent-friendly.
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>Photo gallery (school-provided, with permission)</li>
            <li>More detailed facts and facilities highlights</li>
            <li>Option to add parent perspectives once you’ve collected them</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Sponsored placement</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Sponsored placements help families discover your school on high-intent pages.
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>Clearly labeled as Sponsored in listings</li>
            <li>Placement can appear on area, curriculum, and directory pages</li>
            <li>Does not change fee labels or curriculum tags</li>
          </ul>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>What we need from schools</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>Official school contact (email/phone) for verification</li>
            <li>Latest fee sheet or a clear annual range by age band</li>
            <li>Admissions steps (tour / trial / assessments / start dates)</li>
            <li>Photos you have permission to publish (WebP preferred)</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Request upgrades</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Message us and tell us which school page you want to update. We’ll reply with the quickest next step.
          </p>
          <div className="inlineLinks">
            <a className="btn btnPrimary" href="/contact?source=pricing">
              Contact <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href="/methodology">
              Methodology
            </a>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Notes on trust</h2>
        <ul style={{ marginBottom: 0 }}>
          <li>Sponsored placements are labeled clearly.</li>
          <li>We avoid publishing unlicensed photos. School-provided images are preferred.</li>
          <li>Parent perspectives are optional and must be anonymized.</li>
        </ul>
      </div>
    </div>
  );
}
