import { getAllAreas } from "../../lib/taxonomy";
import type { Metadata } from "next";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Areas in Bali",
  description: "Browse schools by area in Bali and open profiles to compare curriculum, ages, and fees.",
  alternates: { canonical: "https://bestschoolbali.com/areas" },
};

const AREA_THUMBS = new Set([
  "amed",
  "bukit-region",
  "canggu",
  "canggu-sanur",
  "denpasar",
  "sanur",
  "ubud",
]);

export default function AreasPage() {
  const areas = getAllAreas();

  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Areas</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Browse schools by area in Bali.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="areaScroller" style={{ marginTop: 16 }}>
        {areas.map((a) => {
          const slug = a.slug;
          const count = a.count;
          const thumb = AREA_THUMBS.has(slug) ? `/img/areas/${slug}.webp` : "/img/banners/hero.webp";
          return (
            <a key={a.name} className="areaTile" href={`/areas/${slug}`}>
              <img src={thumb} alt="" loading="lazy" />
              <div className="areaTileBody">
                <div className="areaTileTitle">{a.name}</div>
                <div className="areaTileMeta">{count} Schools</div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Filter by budget band</h2>
          <p className="small" style={{ marginTop: 0 }}>
            After choosing an area, budget bands are the quickest way to narrow the shortlist.
          </p>
          <a className="btn btnLink" href="/budget">
            Browse budget bands <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Browse by school type</h2>
          <p className="small" style={{ marginTop: 0 }}>
            If you already know you want an international school or a Montessori approach, start with type.
          </p>
          <a className="btn btnLink" href="/types">
            Browse types <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Fees guide</h2>
          <p className="small" style={{ marginTop: 0 }}>
            Learn what’s usually included (and what’s not) so you can compare total cost fairly.
          </p>
          <div className="inlineLinks">
            <a className="btn" href="/fees">
              Fees overview
            </a>
            <a className="btn" href="/fees/estimate">
              Fee notes
            </a>
          </div>
        </div>
      </div>

      <p className="small" style={{ marginTop: 16 }}>
        Tip: After choosing an area, you can narrow results further by curriculum and budget in the directory.
      </p>
    </div>
  );
}
