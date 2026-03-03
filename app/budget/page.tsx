import type { Metadata } from "next";
import { getAllBudgets } from "../../lib/taxonomy";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Budget bands",
  description:
    "Browse Bali schools by budget band and compare typical annual fee ranges. Use these pages to shortlist schools, then confirm fees directly with admissions.",
  alternates: { canonical: "https://bestschoolbali.com/budget" },
};

export default function BudgetIndexPage() {
  const budgets = getAllBudgets();

  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Budget bands</h1>
            <p className="small" style={{ marginTop: 6 }}>
              A quick way to narrow the directory by typical yearly fees. Always confirm total first-year cost with each
              school.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        {budgets.map((b) => (
          <div key={b.slug} className="card">
            <h3 style={{ marginTop: 0 }}>
              <a href={`/budget/${b.slug}`}>{b.name}</a>
            </h3>
            <div className="small">{b.count} schools</div>
            <p className="small" style={{ marginTop: 10, marginBottom: 0 }}>
              Use this band as a starting point. Some schools list fees publicly, others require an admissions call.
            </p>
            <div className="inlineLinks" style={{ marginTop: 12 }}>
              <a className="btn btnLink" href={`/budget/${b.slug}`}>
                Browse <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Want a faster shortlist?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Start with your area, then confirm age range and curriculum. Budget is the final filter — because one-time fees
            and extras can change the total.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/areas">
              Browse areas
            </a>
            <a className="btn" href="/curriculums">
              Browse curriculums
            </a>
            <a className="btn btnPrimary" href="/schools">
              Open directory
            </a>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Fees guide</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Fees can include (or exclude) registration, uniforms, transport, meals, exams, and activities. Our fees pages
            explain what to ask so you don’t get surprised later.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/fees">
              Fees overview
            </a>
            <a className="btn" href="/fees/estimate">
              Fee notes & estimates
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      </div>

      <p className="small" style={{ marginTop: 16 }}>
        Note: budget bands are based on best-effort annual ranges. Schools may update pricing at any time.
      </p>
    </div>
  );
}
