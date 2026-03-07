import type { Metadata } from "next";
import { getAllSchools, getSchoolBySlug } from "../../../lib/schools";
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
  const title = `Claim profile: ${name}`;
  return {
    title,
    description: `Claim or upgrade the profile for ${name} on Best School Bali.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/claim/${params.slug}` },
  };
}

export default function ClaimPage({ params }: { params: { slug: string } }) {
  const school = getSchoolBySlug(params.slug);
  if (!school) return <div className="container">Not found</div>;

  const message = `Hi Best School Bali — I’d like to claim and update the profile for ${school.name} (${school.area}).`;
  const wa = `https://wa.me/6285285408220?text=${encodeURIComponent(message)}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Schools", item: `${SITE_URL}/schools` },
      { "@type": "ListItem", position: 3, name: school.name, item: `${SITE_URL}/schools/${school.id}` },
      { "@type": "ListItem", position: 4, name: "Claim", item: `${SITE_URL}/claim/${school.id}` },
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
        <span>Claim</span>
      </nav>

      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>Claim this profile</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Request updates for <strong>{school.name}</strong> and ask about verified and featured options.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/contact.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>What you can update</h2>
        <ul style={{ marginBottom: 0 }}>
          <li>Fees and what’s included</li>
          <li>Admissions steps, start dates, and waitlist notes</li>
          <li>Curriculum details and age/grade coverage</li>
          <li>Photos (school-provided, with permission)</li>
          <li>Optional verified badge and featured placement (clearly labeled)</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Contact</h2>
        <p style={{ marginTop: 0 }}>
          The fastest way is WhatsApp. Please message from an official school number or include an official email.
        </p>
        <div className="inlineLinks" style={{ marginTop: 10, marginBottom: 0 }}>
          <a className="btn btnPrimary" href={wa} rel="nofollow">
            Message on WhatsApp <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href="/for-schools/pricing">
            Listing upgrades
          </a>
        </div>
      </div>

      <JsonLd data={breadcrumbJsonLd} />
    </div>
  );
}
