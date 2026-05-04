# pedant-studios-web

Marketing site for [Pedant Studios](https://pedantstudios.com). Built with [Astro](https://astro.build/) and Tailwind CSS, deployed to Vercel.

Published at: **[pedantstudios.com](https://pedantstudios.com)**

Documentation hub is a separate site: [docs.pedantstudios.com](https://docs.pedantstudios.com) ([repo](https://github.com/PedantStudios/pedant-studios-docs)).

## Pages

- `/` — Pedant Studios overview, products list, email signup
- `/webcenter` — Sales-y WebCenter landing
- `/contact` — Contact form (posts to `/api/contact`)
- `/privacy` — Privacy policy (currently placeholder)
- `/terms` — Terms of service (currently placeholder)
- `/404` — Custom 404 page

## API routes (Vercel functions)

- `/api/subscribe` — Adds an email to a Resend Audience
- `/api/contact` — Sends a contact-form email via Resend to a private inbox

Both are server-side. The user's email address is never exposed in HTML.

## Environment variables

Required for forms to work in production. See `.env.example` for the full list.

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender (e.g., `noreply@pedantstudios.com`) |
| `RESEND_TOPIC_ID_GENERAL` | Resend Topic ID for the *general* Pedant Studios updates list (homepage form) |
| `RESEND_TOPIC_ID_WEBCENTER` | Resend Topic ID for the *WebCenter waitlist* (WebCenter page form) |
| `CONTACT_TO_EMAIL` | Where contact-form emails and new-subscriber notifications are delivered |

For local dev, copy `.env.example` to `.env.local` and fill in.

## Local development

```bash
npm install
npm run dev          # http://localhost:4321
```

API routes are not exercised in `astro dev` unless you run with the Vercel CLI. For end-to-end testing of forms, deploy to a Vercel preview environment.

## Build

```bash
npm run build        # → ./dist/
npm run preview      # serve the build locally
```

## Deployment

Auto-deploys to Vercel on every push to `main`. PRs get preview URLs.

- **Production:** pedantstudios.com
- **Vercel project:** pedant-studios-web

## Resend setup (one-time)

1. Verify `pedantstudios.com` in Resend → adds DNS records (SPF, DKIM, DMARC) at Cloudflare
2. Create an API key
3. Create **two Topics** in the Resend dashboard:
   - **Pedant Studios updates** — opt-in default, public visibility
   - **WebCenter updates** — opt-in default, public visibility

   Topics let recipients control which categories they're subscribed to. The Resend-hosted unsubscribe page surfaces both topics so recipients can opt out of one without losing the other.
4. Copy each topic's ID from the dashboard
5. Set all five environment variables in the Vercel project settings

## SEO

- `@astrojs/sitemap` generates `sitemap-index.xml` automatically
- `robots.txt` allows all crawlers and references the sitemap
- Each page has a unique `<title>` and `<meta name="description">`
- Open Graph and Twitter card meta on every page
- JSON-LD: `Organization` (Pedant Studios) on every page; `SoftwareApplication` on `/webcenter`
- Canonical URLs set on every page
- Static prerendering for fast Core Web Vitals

## Brand

- Indigo placeholder palette (matches docs hub) — final visual identity TBD
- Wordmark only; no logo image yet

## License

Site code is MIT. Content (copy, branding) is © Pedant Studios LLC.
