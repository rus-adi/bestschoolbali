import type { Metadata } from "next";

export const dynamic = "error";

const SITE_URL = "https://bestschoolbali.com";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Best School Bali.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="heroInner">
          <div>
            <h1>Privacy</h1>
            <p className="small" style={{ marginTop: 6 }}>
              A simple privacy policy for a small directory.
            </p>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>What we collect</h2>
        <ul style={{ marginBottom: 0 }}>
          <li>We don’t run account logins on this site.</li>
          <li>When you use contact or feedback forms, they open WhatsApp so you can review the message before sending.</li>
          <li>If you message us, we may keep that conversation to follow up on your request.</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Parent perspectives</h2>
        <p className="small" style={{ marginTop: 0 }}>
          If you submit a parent note, please keep it anonymous. We only publish short, anonymized notes and remove identifying
          details.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Contact</h2>
        <p className="small" style={{ marginTop: 0 }}>
          If you want a message deleted or corrected, contact us and we’ll help.
        </p>
        <div className="inlineLinks">
          <a className="btn btnPrimary" href="/contact">
            Contact <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
