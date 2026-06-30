# ReimagineHome Widget — React Demo

A sample React app that embeds the [ReimagineHome](https://reimaginehome.ai) widget on a property listing page via the CDN script. Fork this repo, add your public key, and customize the demo.

---

## Implementation steps

### 1. Clone and install

```bash
git clone <your-fork-url>
cd reimaginehome-widget-react-demo
npm install
```

### 2. Add your public key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Open `.env` and set your ReimagineHome public key:

```env
VITE_REIH_PUBLIC_KEY=your_actual_public_key
```

Replace `your_actual_public_key` with the key from your ReimagineHome account.

> **Never commit `.env`** — it is gitignored. Only `.env.example` (with placeholders) belongs in the repo.

**Where the key is used:** the demo reads `VITE_REIH_PUBLIC_KEY` from `.env` and passes it to the widget script tag as `data-public-key` in [`src/pages/ScriptEmbedPage.tsx`](src/pages/ScriptEmbedPage.tsx). The key is **not** placed on `window.reihWidgetConfig`.

```html
<script
  src="https://widget.styldod.com/widget.js"
  data-public-key="your_actual_public_key"
  async
></script>
```

Restart the dev server after changing `.env`:

```bash
npm run dev
```

### 3. Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). Click **Design interior** on a photo to open the widget.

### 4. (Local dev only) Host images on a public URL

The widget backend must download listing photos from a **public** URL. On localhost, images under `/images/*` are not reachable by the widget API.

Deploy the demo (e.g. Vercel) or use ngrok, then add to `.env`:

```env
VITE_PUBLIC_ASSET_ORIGIN=https://your-deployed-demo.vercel.app
```

Restart `npm run dev`. This is not needed when the app is deployed — `window.location.origin` is used automatically.

### 5. Customize the widget

Edit [`src/widgetConfig.ts`](src/widgetConfig.ts):

| What | Where |
| --- | --- |
| Listing photos | `DEMO_MEDIA` |
| Logo and colors | `buildWidgetBranding()` |
| Sidebar copy and button | `buildWidgetBody()` |
| Widget language | `VITE_REIH_WIDGET_LANGUAGE` in `.env` (default `en-US`) |
| Optional header/footer | `buildWidgetHeader()` / `buildWidgetFooter()` — uncomment in `buildWidgetOptions()` |

### 6. Deploy

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host. Set **`VITE_REIH_PUBLIC_KEY`** in your host’s environment variables at build time.

---

## How it works

1. [`ScriptEmbedPage.tsx`](src/pages/ScriptEmbedPage.tsx) injects `widget.js` with your `data-public-key`.
2. It sets `window.reihWidgetConfig` from `buildScriptEmbedWidgetConfig()` in [`widgetConfig.ts`](src/widgetConfig.ts).
3. When the user clicks **Design interior**, the app calls `window.reihWidget.open()` with the selected photos.

Example `window.reihWidgetConfig` shape (no `public_key` here):

```javascript
window.reihWidgetConfig = {
  media: [{ image_url: "https://example.com/room.jpg" }],
  mode: "simple",
  language: "en-US",
  branding: {
    logo: "https://example.com/logo.png",
    colors: {
      primary: "#071121FF",
      secondary: "#1B232E",
      text_primary: "#071121FF",
      text_secondary: "#1B232E",
    },
  },
  body: {
    text: "Do you like this arrangement?",
    subtext: "Contact the advertiser to ask for details and schedule a live viewing.",
    actions_label: "Close and send message",
  },
  onComplete(detail) { /* ... */ },
  onError(err) { /* ... */ },
  onClose() { /* ... */ },
  onActionClick(event) { /* ... */ },
};
```

---

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_REIH_PUBLIC_KEY` | **Yes** | Your ReimagineHome public key — add in `.env` (see step 2) |
| `VITE_PUBLIC_ASSET_ORIGIN` | Local dev only | Public URL where `/images/*` is hosted (deploy or ngrok) |
| `VITE_REIH_WIDGET_LANGUAGE` | No | Widget UI language (default `en-US`) |
| `VITE_REIH_WIDGET_SCRIPT_URL` | No | Override widget script URL (default: `https://widget.styldod.com/widget.js`) |

---

## Project structure

```
src/
  widgetConfig.ts         # Media, branding, body copy, callbacks
  widgetEnv.ts            # Reads public key and env vars
  pages/
    ScriptEmbedPage.tsx   # Loads widget.js + sets data-public-key
  components/
    ListingDemoPage.tsx   # Sample listing UI
```

---

## License

MIT — use and adapt freely for your own site.
