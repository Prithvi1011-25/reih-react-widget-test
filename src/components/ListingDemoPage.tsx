import { MediaWithWidgetButton } from '../MediaWithWidgetButton';
import { LISTING_MEDIA, type ReihMediaItem } from '../widgetConfig';
import { SiteHeader } from './SiteHeader';
import '../listing.css';

type ListingDemoPageProps = {
  activeNav: 'script-embed' | 'package';
  title: string;
  description: string;
  integrationBadge: string;
  onOpenAll: () => void;
  onOpenSingle: (media: ReihMediaItem) => void;
};

function getGalleryAlt(media: ReihMediaItem, index: number): string {
  if (media.image_url.includes('apartment-building')) {
    return 'Exterior view of a multi-story apartment building';
  }
  if (media.image_url.includes('large-test-25mb')) {
    return 'Large test image (~25MB) for widget stress testing';
  }
  if (media.image_url.includes('large-test-30mb')) {
    return 'Large test image (~35MB) for widget stress testing';
  }
  if (media.image_url.includes('invalid-format')) {
    return 'Invalid format test (text file, not an image)';
  }
  return `Listing photo ${index + 2}`;
}

export function ListingDemoPage({
  activeNav,
  title,
  description,
  integrationBadge,
  onOpenAll,
  onOpenSingle,
}: ListingDemoPageProps) {
  const [heroMedia, ...galleryMedia] = LISTING_MEDIA;

  return (
    <>
      <SiteHeader active={activeNav} showListingAnchors />
      <main className="listing-page">
        <section className="listing-intro" id="listing">
          <p className="integration-badge">{integrationBadge}</p>
          <h1>{title}</h1>
          <p className="listing-intro__description">{description}</p>
        </section>

        <section id="hero" className="hero">
          <MediaWithWidgetButton
            media={heroMedia}
            alt="Modern home exterior with landscaped front yard"
            className="hero__image"
            label="hero photo"
            onOpen={() => {
              onOpenAll();
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
          <h2>
            Photo Gallery ({LISTING_MEDIA.length} photos)
          </h2>
          <div className="gallery">
            {galleryMedia.map((media, index) => (
              <MediaWithWidgetButton
                key={media.image_url}
                media={media}
                alt={getGalleryAlt(media, index)}
                label={`gallery photo ${index + 1}`}
                onOpen={(item) => {
                  if (item) {
                    onOpenSingle(item);
                  }
                }}
              />
            ))}
          </div>
        </section>

        <section className="widget-section" id="widget">
          <button
            type="button"
            id="open-btn"
            className="open-widget-btn"
            onClick={onOpenAll}
          >
            Open ReimagineHome Widget (all photos)
          </button>
        </section>
      </main>
    </>
  );
}
