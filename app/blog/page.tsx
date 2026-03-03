import { getAllPosts, getGuideCategories } from "../../lib/posts";
import type { Metadata } from "next";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical guides for choosing a school in Bali: tours, fees, curriculums, and family logistics.",
  alternates: { canonical: "https://bestschoolbali.com/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = getGuideCategories();

  const groups = new Map<string, typeof posts>();
  for (const p of posts) {
    const key = (p.category ?? "Guides").trim() || "Guides";
    const list = groups.get(key) ?? [];
    list.push(p);
    groups.set(key, list);
  }

  const orderedKeys = Array.from(groups.keys()).sort((a, b) => {
    const ai = categories.findIndex((c) => c.name === a);
    const bi = categories.findIndex((c) => c.name === b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="container" id="top">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Guides</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Practical guides for choosing a school in Bali — fees, areas, curriculums, and admissions.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/blog.webp" alt="" />
          </div>
        </div>
      </section>

      {categories.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="sectionHead" style={{ marginBottom: 10 }}>
            <h2 style={{ margin: 0 }}>Browse by topic</h2>
            <a className="sectionLink" href="/schools">
              Browse schools
            </a>
          </div>
          <div className="tagRow" style={{ marginTop: 0 }}>
            {categories.map((c) => (
              <a key={c.name} className="tag" href={`#${c.name.toLowerCase().replace(/\s+/g, "-")}`}>
                {c.name} ({c.count})
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 16 }}>
        <div className="sectionHead" style={{ marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Directory hubs</h2>
          <a className="sectionLink" href="/schools">
            Open directory
          </a>
        </div>
        <div className="tagRow" style={{ marginTop: 0 }}>
          <a className="tag" href="/areas">
            Areas
          </a>
          <a className="tag" href="/curriculums">
            Curriculums
          </a>
          <a className="tag" href="/types">
            Types
          </a>
          <a className="tag" href="/ages">
            Ages
          </a>
          <a className="tag" href="/budget">
            Budget
          </a>
          <a className="tag" href="/fees">
            Fees
          </a>
          <a className="tag" href="/compare">
            Compare
          </a>
        </div>
      </div>


      {orderedKeys.map((key) => {
        const anchor = key.toLowerCase().replace(/\s+/g, "-");
        const list = groups.get(key) ?? [];
        return (
          <section key={key} id={anchor} className="section">
            <div className="sectionHead">
              <h2 style={{ margin: 0 }}>{key}</h2>
              <a className="sectionLink" href="#top">
                Back to top
              </a>
            </div>
            <div className="grid" style={{ marginTop: 16 }}>
              {list.map((p) => (
                <div key={p.slug} className="card">
                  <h3 style={{ marginTop: 0 }}>
                    <a href={`/blog/${p.slug}`}>{p.title}</a>
                  </h3>
                  <div className="small">{p.date}</div>
                  <p className="small">{p.excerpt}</p>
                  {p.tags?.length ? (
                    <div className="tagRow">
                      {p.tags.slice(0, 4).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <a className="btn btnLink" href={`/blog/${p.slug}`}>
                    Read <span aria-hidden="true">→</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
