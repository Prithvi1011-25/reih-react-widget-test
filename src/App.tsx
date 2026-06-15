import { useCallback, useEffect } from 'react';
import { MediaWithWidgetButton } from './MediaWithWidgetButton';
import {
  LISTING_MEDIA,
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  buildWidgetConfig,
  resolveListingMedia,
  resolveMediaUrl,
  type ReihMediaItem,
} from './widgetConfig';
import './App.css';

const WIDGET_SCRIPT_ID = 'reih-widget-script';

function App() {
  useEffect(() => {
    window.reihWidgetConfig = buildWidgetConfig();
    console.log('Widget config created');
  }, []);

  useEffect(() => {
    if (document.getElementById(WIDGET_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = WIDGET_SCRIPT_ID;
    script.src = `${WIDGET_SCRIPT_URL}?v=${Date.now()}`;
    script.async = true;
    script.setAttribute('data-public-key', WIDGET_PUBLIC_KEY);
    script.onload = () => {
      console.log('Widget script loaded');
    };
    script.onerror = () => {
      console.error('Widget script failed to load');
    };
    document.body.appendChild(script);
  }, []);

  const openWidget = useCallback(async (media: ReihMediaItem[]) => {
    if (!window.reihWidget || typeof window.reihWidget.open !== 'function') {
      console.error('reihWidget is not available yet');
      return;
    }

    try {
      // Always pass media explicitly so the widget creates a fresh session.
      // Calling open() with no args re-shows the previous session unchanged.
      await window.reihWidget.open({
        media: media.map((item) => ({
          ...item,
          image_url: resolveMediaUrl(item.image_url),
        })),
      });
    } catch (error) {
      console.error('Widget open failed:', error);
    }
  }, []);

  const handleOpenAll = useCallback(async () => {
    console.log('Open button clicked (all listing media)');
    await openWidget(resolveListingMedia());
  }, [openWidget]);

  const handleOpenSingle = useCallback(
    async (media?: ReihMediaItem) => {
      if (!media) {
        return;
      }
      console.log('Floating button clicked:', media.image_url);
      await openWidget([media]);
    },
    [openWidget],
  );

  const [heroMedia, ...galleryMedia] = LISTING_MEDIA;

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <span className="site-header__logo">Harborview Realty</span>
          <nav className="site-header__nav">
            <a href="#listing">Listing</a>
            <a href="#gallery">Gallery</a>
            <a href="#widget">Widget Test</a>
          </nav>
        </div>
      </header>

      <main className="listing-page">
        <section className="listing-intro" id="listing">
          <h1>REIH React Widget Compatibility Test</h1>
          <p className="listing-intro__description">
            This sample real estate listing page tests the ReimagineHome hybrid
            iframe widget inside React. The hero Reimagine button opens all
            listing photos; gallery buttons open a single photo each.
          </p>
        </section>

        <section id="hero" className="hero">
          <MediaWithWidgetButton
            media={heroMedia}
            alt="Modern home exterior with landscaped front yard"
            className="hero__image"
            label="hero photo"
            onOpen={() => {
              void handleOpenAll();
            }}
          />
        </section>

        <section className="listing-details">
          <div className="listing-details__price">$875,000</div>
          <h2 className="listing-details__address">742 Maple Ridge Drive</h2>
          <p className="listing-details__meta">4 bed · 3 bath · 2,450 sq ft</p>
          <p className="listing-details__copy">
            Bright open-concept home with vaulted ceilings, updated kitchen, and
            a private backyard patio. Use the hero Reimagine button for all
            photos, or click a gallery button to reimagine that room only.
          </p>
        </section>

        <section className="gallery-section" id="gallery">
          <h2>Photo Gallery</h2>
          <div className="gallery">
            {galleryMedia.map((media, index) => (
              <MediaWithWidgetButton
                key={media.image_url}
                media={media}
                alt={
                  media.image_url.includes('apartment-building')
                    ? 'Exterior view of a multi-story apartment building'
                    : media.image_url.includes('large-test-25mb')
                      ? 'Large test image (~25MB) for widget stress testing'
                      : media.image_url.includes('large-test-30mb')
                        ? 'Large test image (~35MB) for widget stress testing'
                        : media.image_url.includes('invalid-format')
                          ? 'Invalid format test (text file, not an image)'
                          : `Listing photo ${index + 2}`
                }
                label={`gallery photo ${index + 1}`}
                onOpen={handleOpenSingle}
              />
            ))}
          </div>
        </section>

        <section className="widget-section" id="widget">
          <button
            type="button"
            id="open-btn"
            className="open-widget-btn"
            onClick={handleOpenAll}
          >
            Open ReimagineHome Widget (all photos)
          </button>
        </section>
      </main>
    </>
  );
}

export default App;
