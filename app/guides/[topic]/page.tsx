import type { Metadata } from "next";
import { GUIDE_TOPICS, getPostsForTopic } from "../../../lib/guideTopics";
import { slugify } from "../../../lib/slug";
import JsonLd from "../../../components/JsonLd";

const SITE_URL = "https://bestschoolbali.com";

export const dynamicParams = false;
export const dynamic = "error";

export function generateStaticParams(): { topic: string }[] {
  return GUIDE_TOPICS.map((t) => ({ topic: t.slug }));
}

export function generateMetadata({ params }: { params: { topic: string } }): Metadata {
  const slug = slugify(params.topic);
  const topic = GUIDE_TOPICS.find((t) => t.slug === slug);
  const title = topic ? `${topic.name} — Guides` : "Guides";
  const description = topic
    ? topic.description
    : "Guides for parents comparing international schools in Bali.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/guides/${slug}` },
  };
}

export default function GuideTopicPage({ params }: { params: { topic: string } }) {
  const slug = slugify(params.topic);
  const topic = GUIDE_TOPICS.find((t) => t.slug === slug);
  const posts = getPostsForTopic(slug);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: topic?.name ?? "Topic", item: `${SITE_URL}/guides/${slug}` },
    ],
  };

  return (
    <main className="container" style={{ paddingTop: 22 }}>
      <JsonLd data={breadcrumb} />

      <div className="inlineLinks" style={{ marginBottom: 12 }}>
        <a className="btn" href="/guides">
          ← All guide topics
        </a>
        <a className="btn" href="/schools">
          Browse schools
        </a>
        <a className="btn btnPrimary" href="/contact">
          Get guidance
        </a>
      </div>

      <div className="card">
        <h1 style={{ marginTop: 0 }}>{topic?.name ?? "Guides"}</h1>
        <p className="small" style={{ marginTop: 8 }}>
          {topic?.description ??
            "Practical, parent-first notes to help you compare schools without relying on marketing promises."}
        </p>

        <div className="grid" style={{ marginTop: 12 }}>
          {posts.length ? (
            posts.map((p) => (
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
            ))
          ) : (
            <div className="small">No guides found for this topic yet.</div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Directory shortcuts</h2>
        <p className="small" style={{ marginTop: 0 }}>
          Use these pages for the latest, continuously updated school profiles.
        </p>
        <div className="inlineLinks" style={{ marginTop: 12 }}>
          <a className="btn" href="/areas">
            Areas
          </a>
          <a className="btn" href="/curriculums">
            Curriculums
          </a>
          <a className="btn" href="/types">
            School types
          </a>
          <a className="btn" href="/budget">
            Budget bands
          </a>
          <a className="btn" href="/fees">
            Fees overview
          </a>
        </div>
      </div>
    </main>
  );
}
