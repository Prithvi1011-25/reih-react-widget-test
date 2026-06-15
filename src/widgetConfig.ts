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
];

export function buildWidgetConfig() {
  return {
    media: LISTING_MEDIA,
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
