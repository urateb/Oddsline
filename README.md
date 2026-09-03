# Oddsline

A modern sportsbook UI with a sports lobby, live/upcoming events, optional real odds from The Odds API, a full bet slip + open-bets history, theme switching, and responsible gambling UI.

Built with Next.js App Router, React 19, TypeScript, TanStack Query, and Zustand.

## Screenshots

### Live events on desktop

![Desktop live events](docs/screenshots/desktop.png)

### Bet slip on mobile

![Mobile bet slip](docs/screenshots/mobile-bet-slip.png)

## Features

* Sports lobby with server-rendered sports data
* Sport pages with live and upcoming events
* Optional live odds via [The Odds API](https://the-odds-api.com) (falls back to mock + simulator)
* Odds change animations (shorten / drift) on demo feed
* Bet slip with add/remove selections
* Stake validation and confirmation
* Place bet API + open bets history (file-backed demo store)
* Light/dark theme
* Responsible gambling banner with session timer
* Responsive desktop and mobile layouts

## Tech Stack

* Next.js 16 (App Router)
* React 19
* TypeScript (strict mode)
* Tailwind CSS v4
* shadcn/ui
* Zustand
* TanStack Query v5
* React Hook Form + Zod
* Vitest + Testing Library
* Playwright
* pnpm

> React Compiler is enabled. The app still uses `React.memo` where it helps make render boundaries explicit under frequent odds updates.

## Getting Started

Requirements:

* Node.js 20+
* pnpm

```bash
pnpm install
cp .env.example .env.local
# optional: set THE_ODDS_API_KEY for live odds
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Use `localhost` instead of `127.0.0.1` locally — Next treats them as different origins, which can cause HMR/hydration issues.

### Live odds (optional)

1. Create a free key at [the-odds-api.com](https://the-odds-api.com).
2. Set `THE_ODDS_API_KEY` in `.env.local`.
3. Restart the dev server.

Mapped sports: football (EPL), basketball (NBA), ice hockey (NHL), cricket (T20), tennis (ATP). Esports stays on the mock board. Without a key, every sport uses mock fixtures and the client odds simulator.

### Bets

Placing a bet `POST`s to `/api/bets` and persists to `data/bets-store.json` on the server. Open bets load from `GET /api/bets` in the bet slip drawer.

## Scripts

| Command             | Description                |
| ------------------- | -------------------------- |
| `pnpm dev`          | Start development server   |
| `pnpm build`        | Create production build    |
| `pnpm start`        | Run production build       |
| `pnpm lint`         | Run ESLint                 |
| `pnpm format`       | Format files with Prettier |
| `pnpm format:check` | Check formatting           |
| `pnpm typecheck`    | Run TypeScript checks      |
| `pnpm test`         | Run unit tests             |
| `pnpm test:e2e`     | Run Playwright test        |

## Project Structure

```
src/
├── app/                       # Next.js routes + API
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── shared/                # Reusable product components
│   └── providers/             # App providers
├── features/
│   ├── sportsbook/            # Sports data, events, odds simulator
│   ├── bet-slip/              # Bet slip + open bets
│   ├── layout/                # Header and layout
│   └── responsible-gambling/  # RG banner and session timer
├── stores/                    # Zustand stores
├── lib/
│   ├── odds-api/              # The Odds API client + mapping
│   └── bets/                  # Place-bet schema + file store
├── types/                     # Shared TypeScript types
└── data/                      # Mock sportsbook data
```

Shared component docs: `src/components/shared/README.md`

## Architecture

### Server vs client

Server Components fetch and render the lobby and initial sport-page data. Client Components handle live polling, bet slip interactions, theme, timers, and animations — keeping most of the first paint on the server.

### Odds data

`src/features/sportsbook/api.ts` prefers The Odds API when `THE_ODDS_API_KEY` is set and the sport is mapped; otherwise it serves `src/data/sportsbook-mock-data.json`. Sport pages poll `/api/sports/[slug]/events` every 30s on the live feed, or run the client simulator on the demo feed.

### Bets

`POST /api/bets` validates with Zod and writes to a JSON file store. This is a local demo persistence layer — swap the store for a database without changing the UI.

### State management

| Tool              | Responsibility                        |
| ----------------- | ------------------------------------- |
| Server Components | Initial sports and event data         |
| TanStack Query    | Live events, bets list, polling/cache |
| Zustand           | Bet slip, theme and UI state          |

## Testing

Tests focus on regression-prone areas rather than coverage for its own sake.

**Unit:** OddsButton states and flash rules, bet slip store, stake validation, BetSlipCard remove.

**E2E:** Lobby → football → select odds → stake → place bet → confirm → success toast.
