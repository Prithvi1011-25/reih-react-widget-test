import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { getWidgetHostCssVars } from '../widgetConfig';
import '../listing.css';

export function HomePage() {
  return (
    <div className="listing-shell" style={getWidgetHostCssVars()}>
      <SiteHeader active="home" />
      <main className="listing-page home-page">
        <h1>REIH React Widget Compatibility Test</h1>
        <p className="listing-intro__description">
          Sample listing page to test the ReimagineHome widget via the{' '}
          <code>reimaginehome-widget</code> npm package.
        </p>

        <div className="home-cards">
          <Link to="/package" className="home-card home-card--primary">
            <h2>npm Package</h2>
            <p>
              <code>npm install reimaginehome-widget</code>, import{' '}
              <code>reihWidget</code>, call <code>configure()</code> and{' '}
              <code>open()</code>.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
