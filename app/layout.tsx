import "./globals.css";
import type { Metadata } from "next";
import NavToggle from "../components/NavToggle";

const SITE_URL = "https://bestschoolbali.com";
const GA_MEASUREMENT_ID = "G-753DZKBTTG";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Best School Bali",
    template: "%s | Best School Bali",
  },
  description: "Compare international and private schools in Bali by area, curriculum, ages, and budget.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Best School Bali",
    url: SITE_URL,
    title: "Best School Bali",
    description: "Compare international and private schools in Bali by area, curriculum, ages, and budget.",
    images: [{ url: `${SITE_URL}/img/banners/hero.webp` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best School Bali",
    description: "Compare international and private schools in Bali by area, curriculum, ages, and budget.",
    images: [`${SITE_URL}/img/banners/hero.webp`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "Best School Bali",
    url: SITE_URL,
    logo: `${SITE_URL}/img/brand/logo.webp`,
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: "Best School Bali",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/schools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
          }}
        />
      </head>
      <body>
        <header className="siteHeader">
          <div className="container headerInner">
            <a href="/" className="brand" aria-label="Best School Bali">
              <img className="brandLogo" src="/img/brand/logo.webp" alt="" aria-hidden="true" />
              <span className="brandName">Best School Bali</span>
            </a>

            <NavToggle navId="site-nav" />

            <nav id="site-nav" className="nav" data-nav>
              <a className="navLink" href="/">
                Home
              </a>
              <a className="navLink" href="/schools">
                Schools
              </a>
              <a className="navLink" href="/types">
                Types
              </a>
              <a className="navLink" href="/curriculums">
                Curriculums
              </a>
              <a className="navLink" href="/areas">
                Areas
              </a>
              <a className="navLink" href="/guides">
                Guides
              </a>
              <a className="navLink" href="/contact">
                Contact
              </a>

              {/* Mobile-only CTA (shown inside the dropdown menu) */}
              <a className="btn btnPrimary navCta" href="/contact">
                Get Free Guidance <span aria-hidden="true">→</span>
              </a>
            </nav>

            {/* Desktop CTA */}
            <a className="btn btnPrimary headerCta" href="/contact">
              Get Free Guidance <span aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        <main>{children}</main>

        <footer className="siteFooter">
          <div className="container footerInner">
            <div className="small">© {new Date().getFullYear()} Best School Bali</div>
            <div className="small footerLinks">
              <a href="/schools">Schools</a>
              <span aria-hidden="true">·</span>
              <a href="/areas">Areas</a>
              <span aria-hidden="true">·</span>
              <a href="/types">Types</a>
              <span aria-hidden="true">·</span>
              <a href="/curriculums">Curriculums</a>
              <span aria-hidden="true">·</span>
              <a href="/guides">Guides</a>
              <span aria-hidden="true">·</span>
              <a href="/budget">Budget</a>
              <span aria-hidden="true">·</span>
              <a href="/fees">Fees</a>
              <span aria-hidden="true">·</span>
              <a href="/compare">Compare</a>
              <span aria-hidden="true">·</span>
              <a href="/ages">Ages</a>
              <span aria-hidden="true">·</span>
              <a href="/for-schools">For schools</a>
              <span aria-hidden="true">·</span>
              <a href="/methodology">Methodology</a>
              <span aria-hidden="true">·</span>
              <a href="/contact">Contact</a>
              <span aria-hidden="true">·</span>
              <a href="/privacy">Privacy</a>
              <span aria-hidden="true">·</span>
              <a href="/terms">Terms</a>
              <span aria-hidden="true">·</span>
              <a href="https://wa.me/6285285408220" rel="nofollow">
                WhatsApp
              </a>
            </div>
          </div>
        </footer>

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, siteJsonLd]) }}
        />

        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(() => {
  const trackPageView = () => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search + window.location.hash
    });
  };

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    trackPageView();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    trackPageView();
  };

  window.addEventListener('popstate', trackPageView);
  window.addEventListener('hashchange', trackPageView);

  document.addEventListener('click', function (e) {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const clickable = target.closest('button, a');
    if (!clickable) return;

    const clickText = (clickable.textContent || '').trim();
    const clickHref = clickable instanceof HTMLAnchorElement ? (clickable.href || '') : '';

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'button_click',
      click_text: clickText,
      click_url: clickHref,
      page_path: window.location.pathname
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'button_click', {
        click_text: clickText,
        click_url: clickHref,
        page_path: window.location.pathname
      });
    }
  }, { passive: true });
})();`,
          }}
        />
      </body>
    </html>
  );
}
