import type { Metadata } from "next";
import { getAllSchools } from "../../lib/schools";
import { getAllBudgets } from "../../lib/taxonomy";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "School fees in Bali",
  description:
    "A practical overview of international school fees in Bali — what’s usually included, what costs extra, and how to compare total first-year cost across schools.",
  alternates: { canonical: "https://bestschoolbali.com/fees" },
};

function countByStatus() {
  const schools = getAllSchools();
  let listed = 0;
  let estimate = 0;
  for (const s of schools) {
    if (!s.fees?.status) continue;
    if (s.fees.status === "listed") listed += 1;
    if (s.fees.status === "estimate") estimate += 1;
  }
  return { listed, estimate, total: schools.length };
}

export default function FeesOverviewPage() {
  const budgets = getAllBudgets();
  const { listed, estimate, total } = countByStatus();

  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>School fees in Bali</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Fees are a moving target. This directory shows best-effort ranges as a starting point — then you confirm the
              latest fee sheet directly with admissions.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>What the fee numbers usually mean</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Many schools quote tuition per year. The part families miss is the “first-year total” — tuition plus one‑time
            registration, uniforms, transport, meals, exams, and activities.
          </p>
          <ul style={{ marginBottom: 0 }}>
            <li>
              <strong>Listed</strong>: a fee range publicly available (still confirm the latest).
            </li>
            <li>
              <strong>Estimate</strong>: best-effort range based on available info; always request the school’s current fee
              table.
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Directory coverage</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Out of {total} schools in the directory, {listed} have publicly listed ranges and {estimate} are best-effort
            estimates.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/fees/estimate">
              See fee notes
            </a>
            <a className="btn" href="/budget">
              Browse by budget
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Browse by budget band</h2>
        <p className="small" style={{ marginTop: 0 }}>
          Budget bands help you narrow quickly. Within any band, you’ll still see differences by age level and what’s
          included.
        </p>
        <div className="tagRow">
          {budgets.map((b) => (
            <a key={b.slug} className="tag" href={`/budget/${b.slug}`}>
              {b.name} ({b.count})
            </a>
          ))}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Questions to ask every school</h2>
          <ol style={{ marginBottom: 0 }}>
            <li>What is the total first-year cost (tuition + one-time fees)?</li>
            <li>What is included (uniforms, meals, transport, books, exams, activities)?</li>
            <li>Are there discounts (siblings, mid-year entry) or payment plans?</li>
            <li>What refunds apply if plans change?</li>
            <li>Are there additional support fees (EAL/learning support)?</li>
          </ol>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Prefer a short list?</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Tell us your area, your child’s age, and the curriculum you want. We’ll help you shortlist and prepare a
            simple script for admissions calls.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/schools">
              Browse all schools
            </a>
            <a className="btn" href="/methodology">
              How we label fees
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      </div>

      <p className="small" style={{ marginTop: 16 }}>
        Disclaimer: fee data changes frequently. Always confirm directly with the school.
      </p>
    </div>
  );
}
