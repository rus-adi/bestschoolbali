import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Fee notes & estimates",
  description:
    "A directory-wide view of which schools list fees publicly and which have best-effort estimated annual ranges. Always confirm the latest fee sheet with admissions.",
  alternates: { canonical: "https://bestschoolbali.com/fees/estimate" },
};

async function renderMarkdown(md: string) {
  const result = await remark().use(html).process(md);
  return result.toString();
}

function readDataFile(rel: string) {
  const full = path.join(process.cwd(), rel);
  return fs.existsSync(full) ? fs.readFileSync(full, "utf8") : "";
}

export default async function FeeEstimatePage() {
  const listedMd = readDataFile("data/fee_listed.md");
  const estimatesMd = readDataFile("data/fee_estimates.md");

  const listedHtml = listedMd ? await renderMarkdown(listedMd) : null;
  const estimatesHtml = estimatesMd ? await renderMarkdown(estimatesMd) : null;

  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Fee notes & estimates</h1>
            <p className="small" style={{ marginTop: 6 }}>
              This page shows which fee ranges are publicly listed and which are best-effort estimates.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>How to use this</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>If a school is listed, still ask for the latest year’s fee schedule.</li>
            <li>If a fee is estimated, request a written fee sheet before you make decisions.</li>
            <li>Always confirm first-year total cost (tuition + one-time fees + recurring extras).</li>
          </ul>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Shortlist help</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Tell us your area and your child’s age. We’ll suggest a short list and the exact questions to ask.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/budget">
              Browse by budget
            </a>
            <a className="btn" href="/schools">
              Browse directory
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      </div>

      {listedHtml ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>Fees listed publicly</h2>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: listedHtml }} />
        </div>
      ) : null}

      {estimatesHtml ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>Fee estimates</h2>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: estimatesHtml }} />
        </div>
      ) : null}

      <p className="small" style={{ marginTop: 16 }}>
        Important: This is not a substitute for an official fee sheet. Schools may update pricing at any time.
      </p>
    </div>
  );
}
