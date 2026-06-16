import { useCallback, useEffect, useRef } from 'react';
import { reihWidget } from 'reimaginehome-widget';
import { ListingDemoPage } from '../components/ListingDemoPage';
import {
  WIDGET_DEV_API_BASE_URL,
  buildNpmWidgetConfigureOptions,
  clearReihLoader,
  openReihWithMedia,
  resolveListingMedia,
  type ReihMediaItem,
} from '../widgetConfig';

export function PackageIntegrationPage() {
  const openingRef = useRef(false);

  useEffect(() => {
    reihWidget.configure(buildNpmWidgetConfigureOptions());
    console.log(
      '[package] reimaginehome-widget configured (dev API:',
      WIDGET_DEV_API_BASE_URL,
      ')',
    );

    return () => {
      reihWidget.destroy();
      clearReihLoader();
      console.log('[package] reimaginehome-widget destroyed');
    };
  }, []);

  const openWidget = useCallback(async (media: ReihMediaItem[]) => {
    if (openingRef.current) return;

    openingRef.current = true;
    try {
      await openReihWithMedia(reihWidget, media);
    } catch (error) {
      clearReihLoader();
      console.error('[package] Widget open failed:', error);
    } finally {
      openingRef.current = false;
    }
  }, []);

  const handleOpenAll = useCallback(() => {
    console.log('[package] Open button clicked (all listing media)');
    void openWidget(resolveListingMedia());
  }, [openWidget]);

  const handleOpenSingle = useCallback(
    (media: ReihMediaItem) => {
      console.log('[package] Floating button clicked:', media.image_url);
      void openWidget([media]);
    },
    [openWidget],
  );

  return (
    <ListingDemoPage
      activeNav="package"
      title="REIH React Widget — npm Package"
      integrationBadge="Integration: reimaginehome-widget npm package"
      description="Tests the ReimagineHome widget via the reimaginehome-widget npm package using reihWidget.configure() and reihWidget.open() — no CDN script tag."
      onOpenAll={handleOpenAll}
      onOpenSingle={handleOpenSingle}
    />
  );
}
