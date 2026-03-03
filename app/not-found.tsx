export default function NotFound() {
  return (
    <div className="container">
      <section className="hero" style={{ marginTop: 12 }}>
        <div className="heroInner">
          <div>
            <h1>Page not found</h1>
            <p className="small" style={{ marginTop: 6 }}>
              The page you’re looking for doesn’t exist — or may have moved.
            </p>
            <div className="inlineLinks" style={{ marginTop: 12 }}>
              <a className="btn" href="/schools">
                Browse schools
              </a>
              <a className="btn" href="/areas">
                Browse areas
              </a>
              <a className="btn" href="/blog">
                Read guides
              </a>
              <a className="btn btnPrimary" href="/contact">
                Get free guidance
              </a>
            </div>
          </div>
          <div className="heroMedia" aria-hidden="true">
            <img src="/img/banners/hero.webp" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}
