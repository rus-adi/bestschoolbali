import type { Metadata } from "next";
import { getAllSchools, getSchoolBySlug } from "../../../lib/schools";
import { slugify } from "../../../lib/slug";
import { bannerForAreaName } from "../../../lib/banners";
import ParentNoteFormClient from "../../../components/ParentNoteFormClient";
import JsonLd from "../../../components/JsonLd";

export const dynamicParams = false;
export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export function generateStaticParams(): { slug: string }[] {
  return getAllSchools().map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const school = getSchoolBySlug(params.slug);
  const name = school?.name ?? "School";
  const title = `Parent perspectives for ${name}`;
  const description = `Share a short, anonymized parent note about ${name}. We publish only anonymous, helpful notes.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/parent-feedback/${params.slug}` },
  };
}

export default function ParentFeedbackPage({ params }: { params: { slug: string } }) {
  const school = getSchoolBySlug(params.slug);
  if (!school) return <div className="container">Not found</div>;

  const areaSlug = slugify(school.area);
  const banner = bannerForAreaName(school.area);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Schools", item: `${SITE_URL}/schools` },
      { "@type": "ListItem", position: 3, name: school.name, item: `${SITE_URL}/schools/${school.id}` },
      { "@type": "ListItem", position: 4, name: "Parent note", item: `${SITE_URL}/parent-feedback/${school.id}` },
    ],
  };

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/schools">Schools</a>
        <span aria-hidden="true">/</span>
        <a href={`/schools/${school.id}`}>{school.name}</a>
        <span aria-hidden="true">/</span>
        <span>Parent note</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>Share a parent note</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Your note will be published anonymously on the profile for <strong>{school.name}</strong>.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src={banner} alt="" />
          </div>
        </div>
      </section>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Guidelines</h2>
        <ul style={{ marginBottom: 0 }}>
          <li>Keep it anonymous (no names, no phone numbers, no personal identifiers).</li>
          <li>1–3 short sentences is ideal.</li>
          <li>Specific is best: communication, community, learning approach, transitions, support.</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Submit</h2>
        <ParentNoteFormClient school={{ id: school.id, name: school.name, area: school.area }} />
      </div>

      <p className="small" style={{ marginTop: 16 }}>
        Want to browse other schools in {school.area}? <a href={`/areas/${areaSlug}`}>View {school.area} schools</a>.
      </p>

      <JsonLd data={breadcrumbJsonLd} />
    </div>
  );
}
