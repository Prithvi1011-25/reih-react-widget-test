import type { ReihMediaItem, ReihWidgetLanguage } from './widgetConfig';

declare global {
  interface Window {
    reihWidgetConfig?: {
      public_key?: string;
      media: ReihMediaItem[];
      mode: string;
      user_id?: string;
      sidebar_position?: 'left' | 'right';
      branding?: {
        logo: string;
        text_primary: string;
        text_secondary: string;
        primary_color: string;
        heading: string;
        sub_heading: string;
        footer_text: string;
      };
      language?: ReihWidgetLanguage[];
      onComplete?: (detail: unknown) => void;
      onError?: (err: unknown) => void;
      onClose?: () => void;
    };
    reihWidget?: {
      open: (options?: {
        media?: ReihMediaItem[];
        mode?: string;
        branding?: {
          logo: string;
          text_primary: string;
          text_secondary: string;
          primary_color: string;
          heading: string;
          sub_heading: string;
          footer_text: string;
        };
        sidebar_position?: 'left' | 'right';
        language?: ReihWidgetLanguage[];
      }) => Promise<void>;
      close: () => void;
      destroy: () => void;
    };
  }
}

export {};
