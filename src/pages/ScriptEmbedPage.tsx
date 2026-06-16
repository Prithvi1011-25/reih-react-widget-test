import { useCallback, useEffect, useRef } from 'react';
import { ListingDemoPage } from '../components/ListingDemoPage';
import {
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  buildWidgetConfig,
  clearReihLoader,
  openReihWithMedia,
  resolveListingMedia,
  waitForReihWidget,
  type ReihMediaItem,
} from '../widgetConfig';

const WIDGET_SCRIPT_ID = 'reih-widget-script';

export function ScriptEmbedPage() {
  const openingRef = useRef(false);

  useEffect(() => {
    window.reihWidgetConfig = buildWidgetConfig();
    console.log('[script-embed] Widget config created', window.reihWidgetConfig.branding);
  }, []);

  useEffect(() => {
    const existing = document.getElementById(
      WIDGET_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (!existing) {
      const script = document.createElement('script');
      script.id = WIDGET_SCRIPT_ID;
      script.src = `${WIDGET_SCRIPT_URL}?v=${Date.now()}`;
      script.async = true;
      script.setAttribute('data-public-key', WIDGET_PUBLIC_KEY);
      script.onload = () => {
        console.log('[script-embed] Widget script loaded');
      };
      script.onerror = () => {
        console.error('[script-embed] Widget script failed to load');
      };
      document.body.appendChild(script);
    } else if (window.reihWidget?.open) {
      console.log('[script-embed] Widget script already loaded');
    }

    return () => {
      clearReihLoader();
    };
  }, []);

  const openWidget = useCallback(async (media: ReihMediaItem[]) => {
    if (openingRef.current) return;

    openingRef.current = true;
    try {
      const widget = await waitForReihWidget();
      await openReihWithMedia(widget, media);
    } catch (error) {
      clearReihLoader();
      console.error('[script-embed] Widget open failed:', error);
    } finally {
      openingRef.current = false;
    }
  }, []);

  const handleOpenAll = useCallback(() => {
    console.log('[script-embed] Open button clicked (all listing media)');
    void openWidget(resolveListingMedia());
  }, [openWidget]);

  const handleOpenSingle = useCallback(
    (media: ReihMediaItem) => {
      console.log('[script-embed] Floating button clicked:', media.image_url);
      void openWidget([media]);
    },
    [openWidget],
  );

  return (
    <ListingDemoPage
      activeNav="script-embed"
      title="REIH React Widget — CDN Script Embed"
      integrationBadge="Integration: CDN widget.js + window.reihWidgetConfig"
      description="Tests the ReimagineHome hybrid iframe widget via a dynamically loaded script tag and data-public-key attribute — the original embed approach."
      onOpenAll={handleOpenAll}
      onOpenSingle={handleOpenSingle}
    />
  );
}
