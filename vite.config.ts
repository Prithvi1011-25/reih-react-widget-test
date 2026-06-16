import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import {
  WIDGET_DEV_API_BASE_URL,
  WIDGET_DEV_APP_URL,
  WIDGET_PROD_API_BASE_URL,
  WIDGET_PROD_APP_URL,
} from './src/widgetEnv';

/**
 * reimaginehome-widget@0.0.2 is published with REIH_ENV=prod. Rewrite to dev
 * so /package hits the same backend as the CDN script on /script-embed.
 */
function reihWidgetDevEnv(): Plugin {
  return {
    name: 'reih-widget-dev-env',
    transform(code, id) {
      if (!id.includes('node_modules/reimaginehome-widget/dist')) {
        return;
      }

      return {
        code: code
          .replaceAll(WIDGET_PROD_API_BASE_URL, WIDGET_DEV_API_BASE_URL)
          .replaceAll(WIDGET_PROD_APP_URL, WIDGET_DEV_APP_URL)
          .replace('return "prod"', 'return "dev"'),
        map: null,
      };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [reihWidgetDevEnv(), react()],
});
