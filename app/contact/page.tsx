import type { Metadata } from "next";
import { getAllSchools } from "../../lib/schools";
import { getAllAreas, getAllBudgets, getAllCurriculums } from "../../lib/taxonomy";
import GuidanceFormClient from "../../components/GuidanceFormClient";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get free guidance shortlisting schools in Bali, or claim and upgrade a school profile.",
  alternates: { canonical: "https://bestschoolbali.com/contact" },
  openGraph: {
    title: "Contact | Best School Bali",
    description: "Ask for help shortlisting schools, or claim and upgrade a school profile.",
    url: "https://bestschoolbali.com/contact",
    images: [{ url: "https://bestschoolbali.com/img/banners/contact.webp" }],
  },
};

export default function ContactPage() {
  const schools = getAllSchools();
  const schoolsLite = schools.map((s) => ({ id: s.id, name: s.name, area: s.area }));

  const areas = getAllAreas().map((a) => a.name);
  const curriculums = getAllCurriculums().map((t) => t.tag);
  const budgets = getAllBudgets().map((b) => b.name);

  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Contact</h1>
            <p className="small" style={{ marginTop: 6 }}>
              Parents: get a shortlist and a question list for admissions. Schools: claim and upgrade your profile.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/contact.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Message us</h2>
        <GuidanceFormClient areas={areas} curriculums={curriculums} budgets={budgets} schools={schoolsLite} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Prefer a direct WhatsApp link?</h2>
        <p className="small" style={{ marginTop: 0 }}>
          You can also message directly. If you’re claiming a profile, please include an official school email.
        </p>
        <p style={{ marginBottom: 0 }}>
          <a className="btn btnPrimary" href="https://wa.me/62111111" rel="nofollow">
            WhatsApp +62 111111
          </a>
        </p>
      </div>

      <p className="small" style={{ marginTop: 16 }}>
        By contacting us you agree to our <a href="/privacy">privacy</a> and <a href="/terms">terms</a>.
      </p>
    </div>
  );
}
