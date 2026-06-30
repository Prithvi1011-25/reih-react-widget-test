import { useCallback, useEffect, useRef } from 'react';
import { ListingDemoPage } from '../components/ListingDemoPage';
import {
  DEMO_MEDIA,
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  buildScriptEmbedWidgetConfig,
  clearReihLoader,
  isWidgetPublicKeyConfigured,
  openReihWithMedia,
  waitForReihWidget,
  type DemoMediaItem,
} from '../widgetConfig';

const WIDGET_SCRIPT_ID = 'reih-widget-script';

function setScriptEmbedConfig(): void {
  const config = buildScriptEmbedWidgetConfig();
  (window as unknown as { reihWidgetConfig: typeof config }).reihWidgetConfig =
    config;
}

export function ScriptEmbedPage() {
  const openingRef = useRef(false);

  useEffect(() => {
    if (!isWidgetPublicKeyConfigured()) {
      console.warn(
        '[script-embed] Public key not set. Add VITE_REIH_PUBLIC_KEY to `.env` (see README), then restart `npm run dev`.',
      );
      return;
    }

    setScriptEmbedConfig();

    let script = document.getElementById(
      WIDGET_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    const onScriptLoad = () => {
      setScriptEmbedConfig();
    };

    if (!script) {
      script = document.createElement('script');
      script.id = WIDGET_SCRIPT_ID;
      script.src = WIDGET_SCRIPT_URL;
      script.async = true;
      script.setAttribute('data-public-key', WIDGET_PUBLIC_KEY);
      script.addEventListener('load', onScriptLoad);
      script.onerror = () => {
        console.error('[script-embed] Widget script failed to load');
      };
      document.body.appendChild(script);
    } else if (!window.reihWidget?.open) {
      script.addEventListener('load', onScriptLoad);
    }

    return () => {
      script?.removeEventListener('load', onScriptLoad);
      window.reihWidget?.destroy?.();
      clearReihLoader();
    };
  }, []);

  const openWidget = useCallback(async (media: DemoMediaItem[]) => {
    if (!isWidgetPublicKeyConfigured()) return;
    if (openingRef.current) return;

    openingRef.current = true;
    try {
      setScriptEmbedConfig();
      const widget = await waitForReihWidget();
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
    void openWidget(DEMO_MEDIA);
  }, [openWidget]);

  const handleOpenSingle = useCallback(
    (media: DemoMediaItem) => {
      void openWidget([media]);
    },
    [openWidget],
  );

  return (
    <ListingDemoPage
      onOpenAll={handleOpenAll}
      onOpenSingle={handleOpenSingle}
    />
  );
}
