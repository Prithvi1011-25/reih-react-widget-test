import type {
  ReihMediaItem,
  ReihWidgetBranding,
  ReihWidgetCopyBlock,
} from './widgetConfig';

declare global {
  interface Window {
    reihWidgetConfig?: {
      public_key?: string;
      media: ReihMediaItem[];
      mode: string;
      language?: string;
      user_id?: string;
      session_id?: string;
      listing_id?: string;
      branding?: ReihWidgetBranding;
      body?: ReihWidgetCopyBlock;
      header?: ReihWidgetCopyBlock;
      footer?: ReihWidgetCopyBlock;
      onComplete?: (detail: unknown) => void;
      onError?: (err: unknown) => void;
      onClose?: () => void;
      onActionClick?: (event: unknown) => void;
    };
    reihWidget?: {
      open: (options?: {
        media?: ReihMediaItem[];
        mode?: string;
        language?: string;
        branding?: ReihWidgetBranding;
        body?: ReihWidgetCopyBlock;
        header?: ReihWidgetCopyBlock;
        footer?: ReihWidgetCopyBlock;
      }) => Promise<void>;
      close: () => void;
      destroy: () => void;
    };
  }
}

export {};
