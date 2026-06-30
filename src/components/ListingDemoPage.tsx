import { Fragment } from 'react';
import { DesignInteriorButton } from './DesignInteriorButton';
import { SiteHeader } from './SiteHeader';
import {
  LISTING,
  classifyMedia,
  isWidgetPublicKeyConfigured,
  type DemoMediaItem,
} from '../widgetConfig';
import '../listing.css';

type ListingDemoPageProps = {
  onOpenAll: () => void;
  onOpenSingle: (media: DemoMediaItem) => void;
};

export function ListingDemoPage({
  onOpenAll,
  onOpenSingle,
}: ListingDemoPageProps) {
  const { hero, gallery } = classifyMedia();
  const hasPublicKey = isWidgetPublicKeyConfigured();
  const galleryCountLabel = `${gallery.length} ${gallery.length === 1 ? 'photo' : 'photos'}`;

  return (
    <div className="listing-shell">
      <SiteHeader />

      <main className="wrap">
        <section className="intro rise" id="demo">
          <p className="eyebrow">Listing preview</p>
          <h1>{LISTING.title}</h1>
          {!hasPublicKey ? (
            <p className="setup-notice" role="status">
              Add your ReimagineHome public key to <code>.env</code> — see{' '}
              <code>README.md</code> for steps — then restart{' '}
              <code>npm run dev</code>.
            </p>
          ) : null}
        </section>

        {hero ? (
          <section className="hero rise" style={{ animationDelay: '0.06s' }} aria-label="Featured listing photo">
            <img className="hero__img" src={hero.image_url} alt="Featured listing photo" />
            <div className="hero__scrim" />
            <div className="hero__content hero__content--bottom">
              <div className="hero__bottom">
                <div className="hero__meta">
                  <h2 className="hero__title">{LISTING.title}</h2>
                  <div className="hero__facts">
                    {LISTING.facts.map((fact, index) => (
                      <Fragment key={fact}>
                        {index > 0 ? <i /> : null}
                        <span>{fact}</span>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <DesignInteriorButton
                  variant="hero"
                  disabled={!hasPublicKey}
                  onClick={onOpenAll}
                />
              </div>
            </div>
          </section>
        ) : null}

        <div className="gallery-head rise" style={{ animationDelay: '0.12s' }} id="gallery">
          <h2>Gallery</h2>
          <span className="count">{galleryCountLabel}</span>
        </div>

        <section className="grid" aria-label="Listing gallery">
          {gallery.map((item, index) => {
            const photoLabel = String(index + 1).padStart(2, '0');
            return (
              <article
                key={item.image_url}
                className="card rise"
                style={{ animationDelay: `${0.14 + index * 0.03}s` }}
              >
                <img
                  className="card__img"
                  loading="lazy"
                  src={item.image_url}
                  alt={`Listing photo ${photoLabel}`}
                />
                <span className="card__index">{photoLabel}</span>
                <div className="card__overlay">
                  <DesignInteriorButton
                    variant="gallery"
                    disabled={!hasPublicKey}
                    onClick={() => onOpenSingle(item)}
                  />
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
