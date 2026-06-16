import { useCallback, useEffect, useRef } from 'react';
import { ListingDemoPage } from '../components/ListingDemoPage';
import {
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  buildScriptEmbedWidgetConfig,
  clearReihLoader,
  openReihWithMedia,
  resolveListingMedia,
  waitForReihWidget,
  type ReihMediaItem,
} from '../widgetConfig';

const WIDGET_SCRIPT_ID = 'reih-widget-script';

function setScriptEmbedConfig(): void {
  const config = buildScriptEmbedWidgetConfig();
  // public_key comes from <script data-public-key>, not window.reihWidgetConfig
  (window as unknown as { reihWidgetConfig: typeof config }).reihWidgetConfig =
    config;
}

export function ScriptEmbedPage() {
  const openingRef = useRef(false);

  useEffect(() => {
    setScriptEmbedConfig();
    console.log('[script-embed] Widget config created');

    let script = document.getElementById(
      WIDGET_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    const onScriptLoad = () => {
      setScriptEmbedConfig();
      console.log('[script-embed] Widget script loaded');
    };

    if (!script) {
      script = document.createElement('script');
      script.id = WIDGET_SCRIPT_ID;
      script.src = `${WIDGET_SCRIPT_URL}?v=${Date.now()}`;
      script.async = true;
      script.setAttribute('data-public-key', WIDGET_PUBLIC_KEY);
      script.addEventListener('load', onScriptLoad);
      script.onerror = () => {
        console.error('[script-embed] Widget script failed to load');
      };
      document.body.appendChild(script);
    } else if (!window.reihWidget?.open) {
      script.addEventListener('load', onScriptLoad);
    } else {
      console.log('[script-embed] Widget script already loaded');
    }

    return () => {
      script?.removeEventListener('load', onScriptLoad);
      window.reihWidget?.destroy?.();
      clearReihLoader();
    };
  }, []);

  const openWidget = useCallback(async (media: ReihMediaItem[]) => {
    if (openingRef.current) return;

    openingRef.current = true;
    try {
      setScriptEmbedConfig();
      const widget = await waitForReihWidget();
      // Reset stuck CDN widget state (opening flag / stale loader) before each open
      widget.destroy();
      clearReihLoader();
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
