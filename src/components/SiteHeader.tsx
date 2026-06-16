import { Link } from 'react-router-dom';

type SiteHeaderProps = {
  active?: 'home' | 'package';
  showListingAnchors?: boolean;
};

export function SiteHeader({ active, showListingAnchors }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo">
          Harborview Realty
        </Link>
        <nav className="site-header__nav">
          {showListingAnchors ? (
            <>
              <a href="#listing">Listing</a>
              <a href="#gallery">Gallery</a>
              <a href="#widget">Widget Test</a>
            </>
          ) : null}
          <Link to="/" className={active === 'home' ? 'is-active' : undefined}>
            Home
          </Link>
          <Link
            to="/package"
            className={active === 'package' ? 'is-active' : undefined}
          >
            Widget Demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
