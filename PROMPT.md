# LookupCorps — Build Prompt

Paste this into a new Cowork chat (make sure your Desktop folder is connected, or point it at `~/Desktop/lookupcorps` when it asks).

---

## Project brief

Build **LookupCorps**, a modern, free-to-run company lookup web app. It should let anyone search for a company by name, ticker, or domain and see a beautifully designed profile page pulled from free public data sources. Think "IMDb for companies," but for real corporate/registry/financial data rather than movies.

The working folder is `~/Desktop/lookupcorps` on my Mac — do all work there, and commit finished files back into that folder.

## Product requirements

**Core pages**
1. **Landing / search page** — bold hero with a single prominent search bar, example company chips ("Apple", "Tesla", "Stripe", "OpenAI"), and a short value prop. Autocomplete suggestions as the user types (debounced).
2. **Search results page** — grid or list of matching companies with logo, name, jurisdiction, status badge (Active / Dissolved), and a short snippet. Filters for jurisdiction and status.
3. **Company detail page** (the star of the show) — everything organized in clean sections:
   - Header: logo + name + ticker (if public) + industry + status badge + website link
   - Overview: Wikipedia-sourced description, founding year, HQ, employee count if available
   - Officers / directors table
   - Filings list (SEC EDGAR for US, Companies House for UK)
   - Public-company snapshot (market cap, price, P/E, 52-week range) — only if it's a listed company
   - Optional: latest news headlines
4. **404 / empty states** — designed, not default browser text.

**Non-negotiables**
- Fully responsive, mobile-first.
- Dark mode + light mode with a smooth toggle.
- All API keys live on the server, never exposed to the browser.
- Cache API responses aggressively so I don't burn free-tier quotas.
- Graceful loading skeletons and empty states — never show "N/A" spam; hide sections with no data.
- Every company page has a shareable URL (e.g. `/company/[slug-or-id]`).
- Proper attribution footer: "Powered by OpenCorporates, SEC EDGAR, Wikipedia, Clearbit."

## Tech stack

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS + shadcn/ui** for components
- **lucide-react** for icons
- Next.js API routes for the backend proxy layer
- **Upstash Redis** for caching (free tier) — but design so it falls back to an in-memory LRU cache if `UPSTASH_REDIS_REST_URL` isn't set, so I can run locally without signing up on day one
- **Zod** for validating API responses
- Deploy target: **Vercel** (free tier)

## Data sources (all free — combine them)

1. **OpenCorporates API** — global company registry search + officers. Requires free API key (env: `OPENCORPORATES_API_TOKEN`). Show "Powered by OpenCorporates" attribution.
2. **SEC EDGAR** — US public company filings, financials, executives. No key, but requires a `User-Agent` header of the form `LookupCorps your@email.com` (put email in env: `SEC_USER_AGENT_EMAIL`).
3. **Companies House API (UK)** — UK registry, free key (env: `COMPANIES_HOUSE_API_KEY`).
4. **Clearbit Logo API** — `https://logo.clearbit.com/{domain}` — no key, no signup, just for logos.
5. **Wikipedia REST API** — for company descriptions and infobox facts, no key.
6. **Finnhub** (optional) — for live price/market cap of public companies, free key (env: `FINNHUB_API_KEY`). Feature-flag it so the app works without it.

## Build order

1. Scaffold Next.js 14 + TypeScript + Tailwind + shadcn/ui in `~/Desktop/lookupcorps`.
2. Set up the folder structure: `app/`, `components/`, `lib/api/` (one file per data source), `lib/cache.ts`, `lib/types.ts`.
3. Create `.env.example` listing every env var above, plus a `README.md` explaining how to get each key.
4. Build the search API route calling OpenCorporates + a US-public detection that also queries EDGAR.
5. Build the landing page + search UI with the example chips and debounced input.
6. Build the search results page.
7. Build the company detail page with all sections (each section as its own component; render nothing if data is missing).
8. Add the caching layer (Upstash if configured, in-memory otherwise) with a 24-hour TTL.
9. Add dark mode with a toggle in the header.
10. Add loading skeletons, error boundaries, and a designed 404 page.
11. Deploy configuration: `vercel.json` if needed, and a section in the README with one-click deploy instructions.

## Design direction

- Clean, editorial, professional — think Linear, Stripe, Vercel dashboards.
- Generous whitespace, one clear primary action per screen.
- Neutral palette (slate/zinc) with one accent color (pick a deep teal or indigo).
- Rounded-lg cards, subtle borders, no heavy shadows.
- Type: Inter for UI, JetBrains Mono only for tickers/IDs.
- Micro-interactions: subtle hover states, smooth theme transition, skeleton shimmer on load.

## Rules of engagement

- Show me the search page as soon as it renders — I want to see progress, not a wall of files at the end.
- Ask me before installing any dependency not listed above.
- If a free API surprises you (rate limit, schema change, blocked from Vercel), pause and tell me instead of silently working around it.
- Commit meaningful units to the folder as you go so I can review; don't dump everything at once.
- At the end, give me: (a) a one-paragraph "how to run locally", (b) the list of keys I still need to fetch, and (c) a short list of the next 3 features I could add.

## Deliverable

A working Next.js app in `~/Desktop/lookupcorps` that runs with `npm run dev`, searches real companies, and shows a polished detail page for at least one public US company (e.g. Apple) using only free data. README complete, `.env.example` complete, ready to deploy to Vercel.

Go.
