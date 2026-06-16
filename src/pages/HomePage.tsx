import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import '../listing.css';

export function HomePage() {
  return (
    <>
      <SiteHeader active="home" />
      <main className="listing-page home-page">
        <h1>REIH React Widget Compatibility Test</h1>
        <p className="listing-intro__description">
          Choose an integration approach to test the ReimagineHome widget on this
          sample listing page.
        </p>

        <div className="home-cards">
          <Link to="/script-embed" className="home-card">
            <h2>CDN Script Embed</h2>
            <p>
              Original approach: load <code>widget.js</code> from CDN, set{' '}
              <code>window.reihWidgetConfig</code>, use{' '}
              <code>window.reihWidget.open()</code>.
            </p>
          </Link>

          <Link to="/package" className="home-card home-card--primary">
            <h2>npm Package</h2>
            <p>
              New approach: <code>npm install reimaginehome-widget</code>, import{' '}
              <code>reihWidget</code>, call <code>configure()</code> and{' '}
              <code>open()</code>.
            </p>
          </Link>
        </div>
      </main>
    </>
  );
}
