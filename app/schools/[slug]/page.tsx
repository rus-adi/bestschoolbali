import type { Metadata } from "next";
import { getAllSchools, getSchoolBySlug } from "../../../lib/schools";
import { slugify } from "../../../lib/slug";
import { bannerForAreaName } from "../../../lib/banners";
import JsonLd from "../../../components/JsonLd";
import AddToCompareButton from "../../../components/AddToCompareButton";
import { AGE_BANDS } from "../../../lib/ages";
import { remark } from "remark";
import html from "remark-html";
import { recommendGuides } from "../../../lib/posts";
import { getAreaComparisonPairs } from "../../../lib/areaComparisons";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { slug: string }[] {
  return getAllSchools().map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const school = getSchoolBySlug(params.slug);
  if (!school) {
    return {
      title: "School not found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${school.name} — School in ${school.area}, Bali`;
  const description =
    school.summary ??
    `View key facts, fees, curriculum, and admissions notes for ${school.name} in ${school.area}, Bali.`;

  const heroImage = `${SITE_URL}${bannerForAreaName(school.area)}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/schools/${school.id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/schools/${school.id}`,
      images: [{ url: heroImage }],
    },
  };
}

async function renderMarkdown(md: string) {
  type TocItem = { level: number; text: string; id: string };

  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  // Build a deterministic ToC from markdown headings.
  const lines = String(md ?? "").split("\n");
  for (const line of lines) {
    const m = /^(#{2,4})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/\s+#+\s*$/, "").trim();
    if (!text) continue;
    const base = slugify(text);
    const prev = used.get(base) ?? 0;
    used.set(base, prev + 1);
    const id = prev === 0 ? base : `${base}-${prev + 1}`;
    toc.push({ level, text, id });
  }

  const result = await remark().use(html).process(md);
  let htmlStr = result.toString();

  // Inject ids into h2–h4 tags in the same order.
  let idx = 0;
  htmlStr = htmlStr.replace(/<h([2-4])>(.*?)<\/h\1>/g, (match, lvl, inner) => {
    const entry = toc[idx];
    if (!entry) return match;
    idx += 1;
    return `<h${lvl} id="${entry.id}">${inner}</h${lvl}>`;
  });

  return { html: htmlStr, toc };
}

function relatedSchools(currentId: string) {
  const all = getAllSchools();
  const current = all.find((s) => s.id === currentId);
  if (!current) return [];

  const currentTags = new Set(current.curriculum_tags ?? []);

  const scored = all
    .filter((s) => s.id !== currentId)
    .map((s) => {
      let score = 0;
      if (s.area === current.area) score += 3;
      for (const t of s.curriculum_tags ?? []) {
        if (currentTags.has(t)) score += 2;
      }
      if (s.budget_category && s.budget_category === current.budget_category) score += 1;
      if (s.type && current.type && s.type === current.type) score += 1;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name));

  return scored.slice(0, 6).map((x) => x.s);
}

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const school = getSchoolBySlug(params.slug);
  if (!school) return <div className="container">Not found</div>;

  const areaSlug = slugify(school.area);
  const banner = bannerForAreaName(school.area);
  const schoolImage = `/img/schools/${school.id}.webp`;
  const typeSlug = school.type ? slugify(school.type) : null;
  const budgetSlug = school.budget_category ? slugify(school.budget_category) : null;

  const ageBands =
    school.age_min != null && school.age_max != null
      ? AGE_BANDS.filter((b) => school.age_min! <= b.max && school.age_max! >= b.min)
      : [];

  const mapUrl = school.map_query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.map_query)}`
    : null;

  const profile = school.profile_md ? await renderMarkdown(school.profile_md) : null;
  const profileHtml = profile?.html ?? null;
  const toc = profile?.toc ?? [];
  const similar = relatedSchools(school.id);

  const otherAreas = Array.from(new Set(similar.map((s) => s.area).filter((a) => a && a !== school.area))).slice(0, 3);
  const comparePairs = getAreaComparisonPairs().filter(
    (p) =>
      (p.a === school.area && otherAreas.includes(p.b)) ||
      (p.b === school.area && otherAreas.includes(p.a)),
  );

  const guides = recommendGuides({
    area: school.area,
    curriculumTags: school.curriculum_tags ?? [],
    budget: school.budget_category,
    limit: 3,
  });

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Schools", item: `${SITE_URL}/schools` },
    { name: "Areas", item: `${SITE_URL}/areas` },
    { name: school.area, item: `${SITE_URL}/areas/${areaSlug}` },
    { name: school.name, item: `${SITE_URL}/schools/${school.id}` },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: c.name,
      item: c.item,
    })),
  };

  const faqItems = [
    {
      q: "What curriculum does this school offer?",
      a: school.curriculum_tags?.length
        ? `This school lists: ${school.curriculum_tags.join(", ")}. Confirm the current year’s scope, language of instruction, and how placement works for new students.`
        : school.details?.curriculum
          ? school.details.curriculum
          : "Curriculum details are not listed here. Ask the school what framework they follow, the language of instruction, and whether they support student transitions.",
    },
    {
      q: "What ages or grade levels does the school accept?",
      a:
        school.age_min != null && school.age_max != null
          ? `The directory lists ages ${school.age_min}–${school.age_max}. Confirm how those ages map to early years/primary/secondary at this campus.`
          : "Age range is not listed. Ask which year levels they offer and the minimum age for entry.",
    },
    {
      q: "How much are the fees, and what’s included?",
      a: `The listing shows: ${school.fees?.display ?? "Call the school for fees."}${school.fees?.status === "estimate" ? " (estimate)" : ""}. Ask for the total first-year cost (tuition plus one-time fees, uniforms, transport, meals, exams).`,
    },
    {
      q: "Where is the school located, and what is the commute like?",
      a: `The school is listed in ${school.area}. Try a test commute at drop-off and pick-up times if you can, because traffic can change a lot by time of day.`,
    },
    {
      q: "How does admissions typically work?",
      a: "Many schools follow: inquiry → campus tour → application → assessment/interview (if needed) → offer → deposit/contract. Ask about deadlines and waitlists.",
    },
    {
      q: "What documents should we prepare for enrollment?",
      a: "Common requirements include passport/ID, birth certificate, recent school reports, immunization records, and a student photo. International families may also need visa/permit documents.",
    },
    {
      q: "Can we visit the campus or do a trial day?",
      a: "Many schools offer tours and sometimes trial days. Ask what classes your child can sit in, how long the trial is, and whether there is a fee.",
    },
    {
      q: "Do they offer support for students new to English or Bahasa Indonesia?",
      a: "Ask whether they have EAL/ELL support, how placement is assessed, and what extra support costs (if any).",
    },
    {
      q: "What facilities and extracurriculars are available?",
      a: "Ask for the current extracurricular list and whether activities are included or paid separately. If facilities matter (sports, arts, labs), request a campus tour.",
    },
    {
      q: "Do they provide transport, meals, or after-school care?",
      a: "Many schools offer optional transport and after-school programs. Confirm availability for your area and the exact fees.",
    },
    {
      q: "How can we compare this school with others nearby?",
      a: `Start by comparing schools in ${school.area}, then narrow by curriculum and budget. The “Similar schools” section below is a quick shortcut.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const schoolJsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": `${SITE_URL}/schools/${school.id}#school`,
    name: school.name,
    url: `${SITE_URL}/schools/${school.id}`,
    description: school.summary ?? undefined,
    image: `${SITE_URL}${schoolImage}`,
    areaServed: school.area,
    sameAs: school.website ? [school.website] : undefined,
    telephone: school.details?.phone ?? undefined,
    email: school.details?.email ?? undefined,
    address: school.details?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: school.details.address,
          addressLocality: school.area,
          addressRegion: "Bali",
          addressCountry: "ID",
        }
      : undefined,
    additionalProperty: [
      school.age_min != null && school.age_max != null
        ? { "@type": "PropertyValue", name: "Age range", value: `${school.age_min}–${school.age_max}` }
        : null,
      school.curriculum_tags?.length
        ? { "@type": "PropertyValue", name: "Curriculum", value: school.curriculum_tags.join(", ") }
        : null,
      school.fees?.display
        ? { "@type": "PropertyValue", name: "Annual fees", value: school.fees.display }
        : null,
      school.budget_category
        ? { "@type": "PropertyValue", name: "Budget band", value: school.budget_category }
        : null,
    ].filter(Boolean),
  };

  const claimUrl = `/claim/${school.id}`;
  const feedbackUrl = `/parent-feedback/${school.id}`;
  const parentVideoFallback = "/videos/parent-perspective-placeholder.mp4";
  const whatsappGuidance = `https://wa.me/6285285408220?text=${encodeURIComponent(
    `Hi — can you help me shortlist schools? I’m looking at ${school.name} in ${school.area}.`,
  )}`;

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/schools">Schools</a>
        <span aria-hidden="true">/</span>
        <a href={`/areas/${areaSlug}`}>{school.area}</a>
        <span aria-hidden="true">/</span>
        <span>{school.name}</span>
      </nav>

      <div className="schoolHero" style={{ marginTop: 12 }}>
        <img src={banner} alt="" aria-hidden="true" />
        <div className="schoolHeroOverlay">
          <div className="schoolHeroContent">
            <img className="schoolHeroIcon" src={schoolImage} alt="" aria-hidden="true" />
            <div>
              <h1 style={{ margin: 0 }}>
                {school.name}
                {school.verification?.status === "verified" ? <span className="pill">Verified</span> : null}
                {school.sponsorship?.sponsored ? <span className="pill pillSponsored">Sponsored</span> : null}
              </h1>
              <div className="small" style={{ color: "rgba(255,255,255,0.88)" }}>
                <a href={`/areas/${areaSlug}`} style={{ color: "inherit", textDecoration: "underline" }}>
                  {school.area}
                </a>
                {school.type ? (
                  <>
                    {" "}·{" "}
                    <a href={`/types/${typeSlug}`} style={{ color: "inherit", textDecoration: "underline" }}>
                      {school.type}
                    </a>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="kv">
          <div className="small">
            <strong>Fees</strong>
          </div>
          <div>
            {school.fees?.display ?? "Call school for fees."}
            {school.fees?.status === "estimate" ? <span className="pill">Estimate</span> : null}
          </div>

          {school.budget_category ? (
            <>
              <div className="small">
                <strong>Budget</strong>
              </div>
              <div>
                <a href={`/budget/${budgetSlug}`}>{school.budget_category}</a>
              </div>
            </>
          ) : null}

          {school.type ? (
            <>
              <div className="small">
                <strong>Type</strong>
              </div>
              <div>
                <a href={`/types/${typeSlug}`}>{school.type}</a>
              </div>
            </>
          ) : null}

          {school.age_min != null && school.age_max != null ? (
            <>
              <div className="small">
                <strong>Ages</strong>
              </div>
              <div>
                {school.age_min}–{school.age_max}
                {ageBands.length ? (
                  <div className="tagRow" style={{ marginTop: 8 }}>
                    {ageBands.map((b) => (
                      <a key={b.slug} className="tag" href={`/ages/${b.slug}`}>
                        {b.name}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          {school.curriculum_tags?.length ? (
            <>
              <div className="small">
                <strong>Curriculum</strong>
              </div>
              <div>
                <div className="tagRow" style={{ marginTop: 0 }}>
                  {school.curriculum_tags.map((t) => (
                    <a key={t} className="tag" href={`/curriculums/${slugify(t)}`}>
                      {t}
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {school.details?.address ? (
            <>
              <div className="small">
                <strong>Address</strong>
              </div>
              <div>{school.details.address}</div>
            </>
          ) : null}

          {school.website ? (
            <>
              <div className="small">
                <strong>Website</strong>
              </div>
              <div>
                <a href={school.website} target="_blank" rel="noreferrer">
                  {school.website}
                </a>
              </div>
            </>
          ) : null}
        </div>

        <div className="inlineLinks">
          {school.website ? (
            <a className="btn btnPrimary" href={school.website} target="_blank" rel="noreferrer">
              Visit website
            </a>
          ) : null}
          {mapUrl ? (
            <a className="btn" href={mapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          ) : null}
          <a className="btn" href={whatsappGuidance} rel="nofollow">
            Ask on WhatsApp
          </a>
          <AddToCompareButton schoolId={school.id} />
        </div>
      </div>

      {school.summary ? <p style={{ marginTop: 16 }}>{school.summary}</p> : null}

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Parent perspectives</h2>
        {school.parent_perspectives?.length ? (
          <>
            <div className="quoteGrid">
              {school.parent_perspectives.slice(0, 5).map((q, idx) => (
                <figure key={idx} className="quoteCard">
                  <video
                    className="quoteVideo"
                    controls
                    preload="none"
                    playsInline
                    poster={banner}
                    src={q.video ?? parentVideoFallback}
                  />
                  <blockquote>{q.quote}</blockquote>
                  <figcaption className="small">
                    — {q.label}
                    {q.is_example ? " (example)" : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="inlineLinks" style={{ marginTop: 10 }}>
              <a className="btn" href={feedbackUrl}>
                Share another note <span aria-hidden="true">→</span>
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="quoteGrid" style={{ marginBottom: 12 }}>
              {[0, 1, 2].map((i) => (
                <figure key={i} className="quoteCard">
                  <video className="quoteVideo" controls preload="none" playsInline poster={banner} src={parentVideoFallback} />
                  <figcaption className="small">Short parent story video (30s sample)</figcaption>
                </figure>
              ))}
            </div>
            <p className="small" style={{ marginTop: 0 }}>
              We’re collecting short, anonymized notes from families. If you have experience with this school, you can share a
              few lines and we’ll publish it without personal details.
            </p>
            <div className="inlineLinks" style={{ marginTop: 10 }}>
              <a className="btn btnPrimary" href={feedbackUrl}>
                Share a parent note <span aria-hidden="true">→</span>
              </a>
            </div>
          </>
        )}
      </div>

      {school.highlights?.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>Quick notes</h2>
          <ul>
            {school.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {guides.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="sectionHead">
            <h2 style={{ margin: 0 }}>Recommended guides</h2>
            <a className="sectionLink" href="/blog">
              View all guides
            </a>
          </div>
          <div className="grid" style={{ marginTop: 14 }}>
            {guides.map((g) => (
              <div key={g.slug} className="card soft">
                <h3 style={{ marginTop: 0 }}>
                  <a href={`/blog/${g.slug}`}>{g.title}</a>
                </h3>
                <div className="small">{g.excerpt}</div>
                <div className="inlineLinks" style={{ marginTop: 10 }}>
                  <a className="btn btnLink" href={`/blog/${g.slug}`}>
                    Read <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {profileHtml ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>In-depth profile</h2>
          {toc.length >= 2 ? (
            <div className="tocCard">
              <div className="small" style={{ marginTop: 0 }}>
                <strong>On this page</strong>
              </div>
              <ul className="tocList">
                {toc.map((t) => (
                  <li key={t.id} className={`tocLevel${t.level}`}>
                    <a href={`#${t.id}`}>{t.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="markdown" dangerouslySetInnerHTML={{ __html: profileHtml }} />
          <p className="small" style={{ marginBottom: 0 }}>
            Photos on this page are placeholders. Replace them with school-provided images when available.
          </p>
        </div>
      ) : null}

      {similar.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>Similar schools</h2>
          <div className="grid">
            {similar.map((s) => (
              <a key={s.id} className="card schoolCard" href={`/schools/${s.id}`}>
                <div className="schoolCardMedia" aria-hidden="true">
                  <img src={`/img/schools/${s.id}.webp`} alt="" loading="lazy" />
                </div>
                <div className="schoolCardBody">
                  <div className="schoolCardTitle">{s.name}{s.verification?.status === "verified" ? <span className="pill">Verified</span> : null}{s.sponsorship?.sponsored ? <span className="pill pillSponsored">Sponsored</span> : null}</div>
                  <div className="small">
                    <a href={`/areas/${slugify(s.area)}`}>{s.area}</a>
                    {s.type ? ` · ${s.type}` : ""}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {otherAreas.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>Areas families also consider</h2>
          <p className="small" style={{ marginTop: 0 }}>
            These areas appear often among similar schools. Use them as quick shortcuts while you’re shortlisting.
          </p>
          <div className="tagRow" style={{ marginTop: 10 }}>
            {otherAreas.map((a) => (
              <a key={a} className="tag" href={`/areas/${slugify(a)}`}>
                {a}
              </a>
            ))}
          </div>

          {comparePairs.length ? (
            <>
              <div className="small" style={{ marginTop: 12 }}>
                <strong>Area comparisons</strong>
              </div>
              <div className="tagRow" style={{ marginTop: 8 }}>
                {comparePairs.map((p) => {
                  const other = p.a === school.area ? p.b : p.a;
                  return (
                    <a key={p.slug} className="tag" href={`/compare/areas/${p.slug}`}>
                      {school.area} vs {other}
                    </a>
                  );
                })}
              </div>
            </>
          ) : null}

          <div className="inlineLinks" style={{ marginTop: 12 }}>
            <a className="btn" href="/areas">
              Browse all areas
            </a>
            <a className="btn" href="/compare/areas">
              Compare areas
            </a>
          </div>
        </div>
      ) : null}


      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>FAQ</h2>
        <div className="faqList">
          {faqItems.map((f) => (
            <details key={f.q} className="faqItem">
              <summary>{f.q}</summary>
              <div className="faqAnswer">
                <p style={{ marginTop: 0 }}>{f.a}</p>
                {f.q === "Where is the school located, and what is the commute like?" && mapUrl ? (
                  <p style={{ marginTop: 0 }}>
                    Map link: <a href={mapUrl} target="_blank" rel="noreferrer">Google Maps</a>
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Claim & upgrade this profile</h2>
        <p style={{ marginTop: 0 }}>
          School operator? You can claim this page to update fees, admissions notes, and photos. Verified and featured options are
          available and will be clearly labeled.
        </p>
        <div className="inlineLinks">
          <a className="btn btnPrimary" href={claimUrl}>
            Claim this profile <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href="/for-schools/pricing">
            Listing upgrades
          </a>
        </div>
      </div>

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={schoolJsonLd} />
      <JsonLd data={faqJsonLd} />
    </div>
  );
}