import type { ReihMediaItem } from './widgetConfig';

declare global {
  interface Window {
    reihWidgetConfig?: {
      media: ReihMediaItem[];
      mode: string;
      user_id?: string;
      branding: Record<string, string>;
      language: Array<{
        code: string;
        name: string;
        nativeName: string;
      }>;
      onComplete: (detail: unknown) => void;
      onError: (err: unknown) => void;
      onClose: () => void;
    };
    reihWidget?: {
      open: (options?: { media?: ReihMediaItem[] }) => Promise<void>;
      close: () => void;
      destroy: () => void;
    };
  }
}

export {};
