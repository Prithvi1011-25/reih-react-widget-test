export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a href="/" className="brand" aria-label="Styldod home">
          <img
            src="/styldod-icon.svg"
            alt=""
            className="brand__mark"
            width={32}
            height={32}
          />
          <span className="brand__name">Styldod</span>
        </a>
      </div>
    </header>
  );
}
