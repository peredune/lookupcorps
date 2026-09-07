# LookupCorps

**A modern, free-to-run company lookup web app.** Search 200M+ companies by name, ticker or domain and see a clean profile pulled from open sources — OpenCorporates, SEC EDGAR, Companies House, Wikipedia, Clearbit and Finnhub. Think *IMDb for companies*, but with real corporate data.

Built with Next.js 14, Tailwind, and a hand-crafted design system in deep indigo + slate. Ships with dark mode, loading skeletons, designed empty states and a shareable URL for every profile.

---

## Run it locally

```bash
# 1. Install
npm install

# 2. Optional: copy env keys (the app runs with none of them set)
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try searching for **Apple**, **Tesla**, **Stripe** or a UK company like **Deliveroo**. No keys required for a first pass — OpenCorporates and Companies House will simply return nothing until you add their keys, but SEC EDGAR, Wikipedia and Clearbit work out of the box.

---

## Get free API keys

Every key is optional. LookupCorps degrades gracefully — sections without data simply don't render.

| Source            | Key env var                                   | Where to get it                                                                                     | Free-tier limit             |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| OpenCorporates    | `OPENCORPORATES_API_TOKEN`                    | [opencorporates.com/api_accounts/new](https://opencorporates.com/api_accounts/new)                  | 500 requests / month        |
| SEC EDGAR         | `SEC_USER_AGENT_EMAIL` (not a key — an email) | Free & no signup. SEC requires a User-Agent that identifies you.                                    | 10 requests / second        |
| Companies House   | `COMPANIES_HOUSE_API_KEY`                     | [developer.company-information.service.gov.uk/get-started](https://developer.company-information.service.gov.uk/get-started) | 600 requests / 5 min |
| Finnhub *(opt.)*  | `FINNHUB_API_KEY`                             | [finnhub.io/register](https://finnhub.io/register)                                                  | 60 requests / minute        |
| Upstash Redis     | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | [console.upstash.com](https://console.upstash.com)                                          | 10 000 commands / day (free)|
| Wikipedia         | –                                             | Public, no key.                                                                                     | Generous                    |
| Clearbit Logo     | –                                             | Public, no key.                                                                                     | Rate-limited by IP          |

Without Upstash, LookupCorps falls back to an **in-memory LRU cache** so it runs on day one. The trade-off: cache resets on server restart, so serverless deploys will re-hit APIs on every cold start until you wire up Upstash.

---

## Deploy to Vercel

```bash
# Push to GitHub, then:
vercel
```

In the Vercel dashboard, add whichever env vars you have (all optional). Set `NEXT_PUBLIC_SITE_URL=https://yourdomain` so `<meta>` and Open Graph tags resolve correctly.

Free tier is comfortable — the cache is aggressive and the Next.js API routes are edge-friendly.

---

## Architecture

```
app/
  ├─ page.tsx                # Landing / hero + search
  ├─ search/page.tsx         # Results grid + filters
  ├─ company/[id]/page.tsx   # Company detail — the star of the show
  ├─ about, services, login  # Marketing + auth stub
  ├─ api/
  │  ├─ search/              # Full search endpoint
  │  ├─ suggest/             # Autocomplete (fast)
  │  └─ company/[id]/        # Detail endpoint (JSON)
  ├─ layout.tsx              # Fonts, ThemeProvider, Header/Footer
  ├─ globals.css             # Design tokens (indigo + slate)
  ├─ not-found.tsx           # Designed 404
  └─ error.tsx               # Designed error boundary
components/
  ├─ ui/                     # Button, Card, Badge, Input, Skeleton
  ├─ logo.tsx                # Minimal microscope mark
  ├─ header.tsx, footer.tsx
  ├─ search-bar.tsx          # Debounced input + suggestions
  ├─ company-card.tsx
  ├─ company-header.tsx
  ├─ overview-section.tsx
  ├─ officers-table.tsx
  ├─ filings-list.tsx
  └─ public-snapshot.tsx
lib/
  ├─ types.ts                # Unified SearchHit / CompanyDetail
  ├─ utils.ts                # cn(), formatting, domain parsing
  ├─ cache.ts                # Upstash Redis w/ LRU fallback
  ├─ http.ts                 # fetchJson with timeout, SEC User-Agent
  └─ api/                    # One file per data source + aggregators
     ├─ opencorporates.ts
     ├─ edgar.ts
     ├─ companies-house.ts
     ├─ wikipedia.ts
     ├─ clearbit.ts
     ├─ finnhub.ts
     ├─ search.ts            # unifiedSearch() — dedupes + ranks
     └─ detail.ts            # resolveCompanyDetail() — enriches
```

**Design principles**

- Keys never leave the server — every third-party call goes through an `app/api/` route or a server component.
- Every source is best-effort with a timeout. Empty sections don't render.
- Cache is aggressive (24h default) so free-tier quotas last.
- Company URLs are shareable: `/company/us-aapl`, `/company/gb-00000006`, `/company/oc-us_de-1234567`.
- Dark mode is a real design pass, not just inverted colors.

---

## Powered by

OpenCorporates · SEC EDGAR · Companies House · Wikipedia · Clearbit · Finnhub · Upstash Redis
