import type { Metadata } from "next";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How Best School Bali collects and labels school information: fees, curriculum tags, parent perspectives, and sponsored placements.",
  alternates: { canonical: "https://bestschoolbali.com/methodology" },
};

export default function MethodologyPage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Methodology</h1>
            <p className="small" style={{ marginTop: 6 }}>
              We want this directory to be useful for parents and fair to schools. Here’s how we label information.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Fees</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>
              <strong>Listed</strong>: a fee range published publicly (still confirm the latest year and grade-level fees).
            </li>
            <li>
              <strong>Estimate</strong>: a best-effort range based on available information. Always request the school’s
              official fee sheet.
            </li>
            <li>
              We encourage parents to ask for the <strong>total first-year cost</strong> (tuition + one-time fees + recurring
              extras).
            </li>
          </ul>
          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href="/fees">
              Fees overview
            </a>
            <a className="btn" href="/fees/estimate">
              Fee notes
            </a>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Curriculum tags</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Curriculum labels can mean different things at different schools. Tags on this site are meant as a starting
            point — always confirm grade levels covered, language of instruction, and exam pathways.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/curriculums">
              Browse curriculums
            </a>
            <a className="btn" href="/schools">
              Open directory
            </a>
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Parent perspectives</h2>
          <p className="small" style={{ marginTop: 0 }}>
            We publish short notes from families only when they are anonymized (no full names, no identifying details).
            Quotes are optional. If a school has no parent notes yet, the page will say so.
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>We remove personal details and keep quotes short and specific.</li>
            <li>We encourage families to mention their child’s age/grade range (not exact identities).</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Sponsored and featured placements</h2>
          <p className="small" style={{ marginTop: 0 }}>
            If a school pays for featured placement, it will be clearly labeled as <strong>Sponsored</strong>. Sponsored
            placement does not change our directory labels (fees listed vs estimate, curriculum tags, etc.).
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>Sponsored cards are labeled in listings.</li>
            <li>Schools can upgrade profiles with more photos and verified status (where applicable).</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Photos</h2>
        <p className="small" style={{ marginTop: 0 }}>
          Where school-provided photos are not available yet, we use neutral placeholders. When a school claims a profile,
          we can replace placeholders with school-provided images (with permission).
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Need help shortlisting?</h2>
        <p className="small" style={{ marginTop: 0 }}>
          If you share your area, child’s age, and a couple of preferences, we can help you create a shortlist and draft the
          admissions questions.
        </p>
        <div className="inlineLinks">
          <a className="btn" href="/schools">
            Browse schools
          </a>
          <a className="btn" href="/areas">
            Browse areas
          </a>
          <a className="btn btnPrimary" href="/contact">
            Get free guidance
          </a>
        </div>
      </div>
    </div>
  );
}
