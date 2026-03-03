import type { Metadata } from "next";

export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Best School Bali.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Terms</h1>
            <p className="small" style={{ marginTop: 6 }}>
              A simple set of terms for using this directory.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Directory information</h2>
        <p className="small" style={{ marginTop: 0 }}>
          We do our best to keep listings accurate, but schools can change fees, year levels, and policies at any time. Please
          confirm details directly with admissions.
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li>Fees are shown as best-effort annual ranges (listed vs estimate).</li>
          <li>Curriculum tags are a starting point — always confirm year levels and exam pathways.</li>
          <li>Photos may be placeholders until a school provides images with permission.</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Sponsored listings</h2>
        <p className="small" style={{ marginTop: 0 }}>
          Sponsored placements are clearly labeled. Sponsorship does not change how we label fees or curriculum tags.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Contact</h2>
        <p className="small" style={{ marginTop: 0 }}>
          If you spot an error, please message us and we’ll update it.
        </p>
        <div className="inlineLinks">
          <a className="btn btnPrimary" href="/contact">
            Contact <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href="/methodology">
            Methodology
          </a>
        </div>
      </div>
    </div>
  );
}
