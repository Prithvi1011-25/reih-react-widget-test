/** Production widget script URL — override with VITE_REIH_WIDGET_SCRIPT_URL if needed. */
export const WIDGET_SCRIPT_URL =
  import.meta.env.VITE_REIH_WIDGET_SCRIPT_URL ||
  'https://widget.styldod.com/widget.js';

/**
 * Public origin for /images/* when running on localhost.
 * The widget API must download photos from a public URL — not localhost.
 * Set to your deployed demo URL (or ngrok tunnel) when testing locally.
 */
export const PUBLIC_ASSET_ORIGIN =
  import.meta.env.VITE_PUBLIC_ASSET_ORIGIN || '';

/**
 * Your ReimagineHome public key.
 * Set VITE_REIH_PUBLIC_KEY in `.env` (copy from `.env.example`).
 */
export const WIDGET_PUBLIC_KEY = import.meta.env.VITE_REIH_PUBLIC_KEY || '';

/** Widget UI language — overrides the default tied to your public key (e.g. pl-PL for Otodom). */
export const WIDGET_LANGUAGE =
  import.meta.env.VITE_REIH_WIDGET_LANGUAGE || 'en-US';

const PLACEHOLDER_KEYS = new Set(['', 'your_public_key_here', 'public_key']);

export function isWidgetPublicKeyConfigured(): boolean {
  return !PLACEHOLDER_KEYS.has(WIDGET_PUBLIC_KEY.trim());
}

export function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]'
  );
}
