import type { Metadata } from "next";
import { getAllPosts } from "../../lib/posts";
import { getGuideTopicsWithCounts } from "../../lib/guideTopics";

const SITE_URL = "https://bestschoolbali.com";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Guides for choosing a school in Bali",
  description:
    "Practical guides for parents comparing international schools in Bali — admissions, fees, curriculum, and area shortlists.",
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default function GuidesHubPage() {
  const topics = getGuideTopicsWithCounts();
  const posts = getAllPosts();

  return (
    <main className="container" style={{ paddingTop: 22 }}>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Guides</h1>
        <p className="small" style={{ marginTop: 8 }}>
          If you are new to Bali schooling, start with a shortlist, then confirm age coverage and curriculum, and only then
          compare total first-year cost. These guides are written to help you ask better questions and avoid surprises.
        </p>

        <div className="inlineLinks" style={{ marginTop: 12 }}>
          <a className="btn" href="/schools">
            Browse schools
          </a>
          <a className="btn" href="/areas">
            Browse areas
          </a>
          <a className="btn" href="/curriculums">
            Browse curriculums
          </a>
          <a className="btn" href="/fees">
            Fees overview
          </a>
          <a className="btn btnPrimary" href="/contact">
            Get guidance
          </a>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Topics</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Use these topic pages as hubs — each one links into the directory pages that stay up to date.
          </p>
          <div className="grid" style={{ marginTop: 12 }}>
            {topics.map((t) => (
              <a key={t.slug} className="card" href={`/guides/${t.slug}`}>
                <div style={{ fontWeight: 800 }}>{t.name}</div>
                <div className="small" style={{ marginTop: 6 }}>
                  {t.description}
                </div>
                <div className="small" style={{ marginTop: 10 }}>
                  {t.count} guide{t.count === 1 ? "" : "s"}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0 }}>Latest guides</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Newest additions. If you are researching a specific school, open its profile for the most current details.
          </p>

          <div className="grid" style={{ marginTop: 12 }}>
            {posts.slice(0, 8).map((p) => (
              <a key={p.slug} className="card" href={`/blog/${p.slug}`}>
                <div style={{ fontWeight: 800 }}>{p.title}</div>
                <div className="small" style={{ marginTop: 6 }}>
                  {p.excerpt}
                </div>
                <div className="small" style={{ marginTop: 10 }}>
                  {p.date}
                  {p.category ? ` · ${p.category}` : ""}
                </div>
              </a>
            ))}
          </div>

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href="/blog">
              View all posts
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
