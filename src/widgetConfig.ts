export type ReihMediaItem = {
  image_url: string;
};

export {
  WIDGET_DEV_API_BASE_URL,
  WIDGET_DEV_APP_URL,
} from './widgetEnv';

export const WIDGET_SCRIPT_URL =
  'https://reimaginehome-embed-widget-app-git-dev-styldod.vercel.app/widget.js';

/** Replace with your real public key from ReimagineHome */
export const WIDGET_PUBLIC_KEY = 'public_key';

export const LISTING_MEDIA: ReihMediaItem[] = [
  {
    image_url:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop',
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1721244653580-79577d2822a2?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1619418602850-35ad20aa1700?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1721244654210-a505a99661e9?q=80&w=1704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    image_url: '/images/apartment-building.png',
  },
  {
    image_url: '/images/large-test-25mb.jpg',
  },
  {
    image_url: '/images/large-test-30mb.jpg',
  },
  {
    // Invalid format test — plain text file, not an image
    image_url: '/images/invalid-format.txt',
  },
  {
    // Invalid format test — plain text file, not an image
    image_url: 'https://images.unsplash.com/photo-1630699144919-681cf308ae82?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

/** DOM id used by reimaginehome-widget for the session loader overlay */
export const REIH_LOADER_ID = 'reih-host-loader';

/** Remove a stuck loader overlay (widget destroy() does not always clear it). */
export function clearReihLoader(): void {
  document.getElementById(REIH_LOADER_ID)?.remove();
}

/** Host-side open helper — clears stale loader, then opens with resolved media. */
export async function openReihWithMedia(
  widget: NonNullable<Window['reihWidget']>,
  media: ReihMediaItem[],
): Promise<void> {
  clearReihLoader();
  await widget.open({
    media: media.map((item) => ({
      ...item,
      image_url: resolveMediaUrl(item.image_url),
    })),
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

/** Local /images/* paths need a full URL for the widget backend to fetch them */
export function resolveMediaUrl(url: string): string {
  if (url.startsWith('/') && typeof window !== 'undefined') {
    return `${window.location.origin}${url}`;
  }
  return url;
}

export function resolveListingMedia(media: ReihMediaItem[] = LISTING_MEDIA): ReihMediaItem[] {
  return media.map((item) => ({
    ...item,
    image_url: resolveMediaUrl(item.image_url),
  }));
}

const WIDGET_BRANDING = {
  logo: 'https://ecdn.styldod.com/assets/logo/6a2bca9bce2a355c2c13d058.svg',
  text_primary: '#071121FF',
  text_secondary: '#1B232E',
  primary_color: '#3ED37A',
  heading: 'Reimagine Your Space',
  sub_heading: 'AI-powered room redesign',
  footer_text: '',
};

const WIDGET_LANGUAGE = [
  {
    code: 'en-US',
    name: 'English (United States)',
    nativeName: 'English (US)',
  },
  {
    code: 'en-GB',
    name: 'English (United Kingdom)',
    nativeName: 'English (UK)',
  },
  { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
];

export function buildWidgetConfig() {
  return {
    public_key: WIDGET_PUBLIC_KEY,
    media: resolveListingMedia(),
    mode: 'simple' as const,
    branding: WIDGET_BRANDING,
    sidebar_position: 'right' as const,
    language: WIDGET_LANGUAGE,
    onComplete: (detail: unknown) => {
      console.log('[reih] onComplete:', detail);
    },
    onError: (err: unknown) => {
      console.error('[reih] onError:', err);
    },
    onClose: () => {
      console.log('[reih] onClose: widget closed');
    },
  };
}

/** Config for reimaginehome-widget npm package — includes public_key in configure() */
export function buildNpmWidgetConfigureOptions() {
  const base = buildWidgetConfig();
  return {
    public_key: WIDGET_PUBLIC_KEY,
    media: base.media,
    mode: base.mode,
    branding: base.branding,
    sidebar_position: base.sidebar_position,
    language: base.language,
    onComplete: base.onComplete,
    onError: base.onError,
    onClose: base.onClose,
  };
}
