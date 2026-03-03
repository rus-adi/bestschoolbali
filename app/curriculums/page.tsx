import { getAllCurriculums } from "../../lib/taxonomy";
import type { Metadata } from "next";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Curriculums in Bali",
  description: "Explore schools by curriculum approach (IB, Cambridge, Montessori, and more).",
  alternates: { canonical: "https://bestschoolbali.com/curriculums" },
};

export default function CurriculumsPage() {
  const tags = getAllCurriculums();

  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Curriculums</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Explore schools by curriculum approach.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        {tags.map((t) => (
          <div key={t.tag} className="card">
            <h3 style={{ marginTop: 0 }}>
              <a href={`/curriculums/${t.slug}`}>{t.tag}</a>
            </h3>
            <div className="small">{t.count} schools</div>
            <div className="inlineLinks" style={{ marginTop: 10 }}>
              <a className="btn btnLink" href={`/curriculums/${t.slug}`}>
                Browse <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Combine curriculum with area</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Curriculum is important, but daily commute is often the deciding factor. Pick an area first, then shortlist.
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
          <h2 style={{ marginTop: 0 }}>Browse by school type</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Type labels can help if you’re looking for something specific (international, bilingual, Montessori, etc.).
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/types">
              School types
            </a>
            <a className="btn" href="/areas">
              Areas
            </a>
          </div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Fees and budget</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Compare schools using total first-year cost. Budget bands are a quick way to narrow your shortlist.
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

      <p className="small" style={{ marginTop: 16 }}>
        Tip: You can combine curriculum with area and budget filters on the directory page.
      </p>
    </div>
  );
}
