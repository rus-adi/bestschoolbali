import type { Metadata } from "next";

export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export const metadata: Metadata = {
  title: "For Schools",
  description: "Claim your listing on Best School Bali, add school-provided photos, and request verified or featured placement (clearly labeled).",
  alternates: { canonical: `${SITE_URL}/for-schools` },
  openGraph: {
    title: "For Schools | Best School Bali",
    description: "Claim your listing, add photos, and request verified or featured placement (clearly labeled).",
    url: `${SITE_URL}/for-schools`,
    images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
  },
};

export default function ForSchoolsPage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>For schools</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Claim your profile, keep fees and admissions notes accurate, and upgrade with verified and featured options.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Claim your profile</h2>
          <ol style={{ marginBottom: 0 }}>
            <li>Message us via WhatsApp with your school name and official contact details.</li>
            <li>Send your latest fee sheet (or a summary range) and admissions notes.</li>
            <li>We’ll update your page and show a “last updated” note where relevant.</li>
          </ol>
          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn btnPrimary" href="/contact?source=for-schools">
              Contact <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href="/for-schools/pricing">
              Listing upgrades
            </a>
            <a className="btn" href="/methodology">
              Methodology
            </a>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Verified profile</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Verified is designed to increase trust for families. Verification methods can include an official email confirmation
            and an up-to-date fee/admissions document.
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>Verified badge shown on your listing and profile</li>
            <li>Optional “last verified” date</li>
            <li>Priority for fee and admissions updates</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Featured placement</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Featured spots help families discover your school on key pages (areas, curriculum pages, and the homepage).
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>Clearly labeled as Sponsored</li>
            <li>Does not change curriculum tags or fee labels</li>
            <li>Best paired with a photo gallery and verified badge</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Photos & galleries</h2>
          <p className="small" style={{ marginTop: 0 }}>
            We only publish photos that are school-provided (or explicitly licensed). When you claim a profile, we can add a
            full gallery.
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>Suggested set: campus exterior, classrooms, outdoor areas, activities, and facilities</li>
            <li>Provide short captions and confirm you have permission to share</li>
            <li>WebP format is preferred</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Ready to update your listing?</h2>
        <p className="small" style={{ marginTop: 0 }}>
          Message us and we’ll walk you through the quickest way to update fees, admissions notes, and photos.
        </p>
        <div className="inlineLinks">
          <a className="btn btnPrimary" href="/contact?source=for-schools">
            Contact <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href="/for-schools/pricing">
            Listing upgrades
          </a>
          <a className="btn" href="/schools">
            View directory
          </a>
        </div>
      </div>
    </div>
  );
}
