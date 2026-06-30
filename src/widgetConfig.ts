import {
  PUBLIC_ASSET_ORIGIN,
  WIDGET_LANGUAGE,
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  isLocalDevHost,
  isWidgetPublicKeyConfigured,
} from './widgetEnv';

export {
  PUBLIC_ASSET_ORIGIN,
  WIDGET_LANGUAGE,
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_URL,
  isWidgetPublicKeyConfigured,
};

export type ReihMediaItem = {
  image_url: string;
};

export type DemoMediaItem = ReihMediaItem & {
  hero?: boolean;
};

export const LISTING = {
  title: 'Willow Terrace Residence',
  facts: ['4 bed', '2 bath', '2 story', 'Terrace'],
};

const WILLOW_TERRACE_BASE = '/images/willow-terrace';

export const DEMO_MEDIA: DemoMediaItem[] = [
  { hero: true, image_url: `${WILLOW_TERRACE_BASE}/08_living_room_furnished.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/07_entry_hallway.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/09_living_room_angle2.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/living_room_angle3.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/living_room_angle4.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/10_kitchen_furnished.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/11_kitchen_dining_angle.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/13_staircase_landing.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/14_master_bedroom_furnished.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/15_bedroom2_empty.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/16_kids_room_furnished.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/16_kids_room_angle2.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/17_study_empty.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/18_bathroom1_empty.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/19_bathroom2_empty.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/20_laundry_utility.png` },
  { image_url: `${WILLOW_TERRACE_BASE}/21_balcony_terrace.png` },
];

/** @deprecated Use DEMO_MEDIA */
export const LISTING_MEDIA = DEMO_MEDIA;

export function classifyMedia(items: DemoMediaItem[] = DEMO_MEDIA) {
  const hero = items.find((item) => item.hero) ?? items[0];
  const gallery = items.filter((item) => item !== hero);
  return { hero, gallery };
}

/** Widget only wants { image_url } — strip host-side flags like `hero`. */
export function toWidgetMedia(items: DemoMediaItem[]): ReihMediaItem[] {
  return items.map((item) => ({
    image_url: resolveMediaUrl(item.image_url),
  }));
}

/** DOM id used by reimaginehome-widget for the session loader overlay */
export const REIH_LOADER_ID = 'reih-host-loader';

/** Remove a stuck loader overlay (widget destroy() does not always clear it). */
export function clearReihLoader(): void {
  document.getElementById(REIH_LOADER_ID)?.remove();
}

/** Minimal widget API used by both CDN and npm integrations. */
export type ReihWidgetOpener = {
  open: (overrides?: Record<string, unknown>) => Promise<void>;
};

export type ReihWidgetBrandingColors = {
  primary: string;
  secondary: string;
  text_primary: string;
  text_secondary: string;
};

export type ReihWidgetBranding = {
  logo: string;
  colors: ReihWidgetBrandingColors;
};

export type ReihWidgetCopyBlock = {
  text: string;
  subtext: string;
  actions_label: string;
};

export function buildWidgetBranding(): ReihWidgetBranding {
  return {
    logo: '/styldod-logo.png',
    colors: {
      primary: '#071121FF',
      secondary: '#1B232E',
      text_primary: '#071121FF',
      text_secondary: '#1B232E',
    },
  };
}

export function buildWidgetBody(): ReihWidgetCopyBlock {
  return {
    text: 'Do you like this arrangement?',
    subtext:
      'Contact the advertiser to ask for details and schedule a live viewing.',
    actions_label: 'Close and send message',
  };
}

/** Optional header copy — uncomment in buildWidgetOptions() to enable. */
export function buildWidgetHeader(): ReihWidgetCopyBlock {
  return {
    text: 'Visualize Your Space',
    subtext: 'See how this property could look with different styles',
    actions_label: 'Schedule a Viewing',
  };
}

/** Optional footer copy — uncomment in buildWidgetOptions() to enable. */
export function buildWidgetFooter(): ReihWidgetCopyBlock {
  return {
    text: 'Powered by ReimagineHome',
    subtext: 'AI-powered interior design at your fingertips',
    actions_label: 'Learn More',
  };
}

/** CSS vars for host page accents (widget receives branding via configure/open). */
export function getWidgetHostCssVars(): Record<string, string> {
  const { colors } = buildWidgetBranding();
  return {
    '--reih-primary': colors.primary.replace(/ff$/i, ''),
    '--reih-text-primary': colors.text_primary.replace(/ff$/i, ''),
    '--reih-text-secondary': colors.text_secondary,
  };
}

/** Local /images/* paths need a public URL the widget API can fetch (not localhost). */
export function resolveMediaUrl(url: string): string {
  if (!url.startsWith('/') || typeof window === 'undefined') {
    return url;
  }

  const isLocal = isLocalDevHost(window.location.hostname);
  const origin =
    isLocal && PUBLIC_ASSET_ORIGIN
      ? PUBLIC_ASSET_ORIGIN.replace(/\/$/, '')
      : window.location.origin;

  if (isLocal && !PUBLIC_ASSET_ORIGIN) {
    console.warn(
      '[reih] Widget cannot load local images without VITE_PUBLIC_ASSET_ORIGIN. Deploy the demo or use an ngrok URL, then set it in .env and restart.',
    );
  }

  return `${origin}${url}`;
}

export function resolveDemoMedia(media: DemoMediaItem[] = DEMO_MEDIA): ReihMediaItem[] {
  return toWidgetMedia(media);
}

/** @deprecated Use resolveDemoMedia */
export const resolveListingMedia = resolveDemoMedia;

const widgetCallbacks = {
  onComplete: (detail: unknown) => {
    console.log('[reih] onComplete:', detail);
  },
  onError: (err: unknown) => {
    console.error('[reih] onError:', err);
  },
  onClose: () => {
    console.log('[reih] onClose: widget closed');
  },
  onActionClick: (event: unknown) => {
    console.log('[reih] onActionClick:', event);
  },
};

/** Shared widget options used by configure(), window.reihWidgetConfig, and open(). */
export function buildWidgetOptions() {
  const branding = buildWidgetBranding();
  return {
    mode: 'simple' as const,
    language: WIDGET_LANGUAGE,
    // user_id: 'demo-user-123',
    // session_id: 'demo-client-session-123',
    // listing_id: 'demo-listing-123',
    branding: {
      ...branding,
      logo: resolveMediaUrl(branding.logo),
    },
    body: buildWidgetBody(),
    // header: buildWidgetHeader(),
    // footer: buildWidgetFooter(),
    ...widgetCallbacks,
  };
}

/**
 * CDN script-embed config for window.reihWidgetConfig.
 * public_key comes from the <script data-public-key> attribute, not this object.
 */
export function buildScriptEmbedWidgetConfig() {
  return {
    media: resolveDemoMedia(),
    ...buildWidgetOptions(),
  };
}

/** Host-side open helper — opens with resolved media and latest widget options. */
export async function openReihWithMedia(
  widget: ReihWidgetOpener,
  media: DemoMediaItem[],
): Promise<void> {
  clearReihLoader();
  await widget.open({
    media: toWidgetMedia(media),
    ...buildWidgetOptions(),
  });
}

/** Wait until the CDN-injected window.reihWidget API is ready. */
export function waitForReihWidget(
  timeoutMs = 30_000,
): Promise<NonNullable<Window['reihWidget']>> {
  const existing = window.reihWidget;
  if (existing && typeof existing.open === 'function') {
    return Promise.resolve(existing);
  }

  return new Promise((resolve, reject) => {
    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="widget.js"]',
    );

    let settled = false;
    const finish = (widget: NonNullable<Window['reihWidget']>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearInterval(poller);
      script?.removeEventListener('load', tryResolve);
      resolve(widget);
    };

    const tryResolve = () => {
      const widget = window.reihWidget;
      if (widget && typeof widget.open === 'function') {
        finish(widget);
      }
    };

    script?.addEventListener('load', tryResolve);
    const poller = window.setInterval(tryResolve, 50);

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      clearInterval(poller);
      script?.removeEventListener('load', tryResolve);
      reject(new Error('[reih] Widget script did not load in time'));
    }, timeoutMs);

    tryResolve();
  });
}
