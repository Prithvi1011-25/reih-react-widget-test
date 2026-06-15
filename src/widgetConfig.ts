export type ReihMediaItem = {
  image_url: string;
};

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
];

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

export function buildWidgetConfig() {
  return {
    media: resolveListingMedia(),
    mode: 'simple' as const,
    branding: {
      fav_icon: 'https://placehold.co/32x32/png?text=F',
      logo: 'https://placehold.co/200x60/png?text=Logo',
      text_primary: '#4C1D95',
      text_secondary: '#7C3AED',
      heading: 'Reimagine Your Space',
      sub_heading: 'AI-powered room redesign',
      footer_text: 'Powered by ReimagineHome',
    },
    language: [
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
    ],
    onComplete: (detail: unknown) => {
      console.log('Widget completed:', detail);
    },
    onError: (err: unknown) => {
      console.error('Widget error:', err);
    },
    onClose: () => {
      console.log('Widget closed');
    },
  };
}
