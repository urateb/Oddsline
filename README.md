# Oddsline

A production-minded sportsbook frontend exploring real-time data, complex client state and interactive betting flows.

**[Live Demo](https://oddsline-sports.vercel.app/)** · **[Screenshots](#screenshots)**

The app is designed to run without credentials. Live odds use [The Odds API](https://the-odds-api.com) when a key is configured. Without one, the query layer falls back to mock fixtures and simulated prices — so a recruiter can clone the repo and still walk the full betting flow.

## Key features

- Sportsbook lobby and event navigation
- Live/updating odds
- Interactive bet slip
- Stake validation and payout calculations
- Open ticket management
- Live API + deterministic mock-data fallback
- Responsive UI
- Unit/component testing
- End-to-end testing

## Screenshots

![Home](docs/screenshots/desktop.png)

![Event board](docs/screenshots/desktop-board.png)

![Mobile bet slip](docs/screenshots/mobile-bet-slip.png)

## Architecture

Oddsline keeps the UI on a single set of domain types (`Event`, `Market`, `Selection`). A query layer decides where those objects come from:

```
                    ┌── The Odds API (when configured)
UI → Query layer ───┤
                    └── Mock data adapter
```

When `THE_ODDS_API_KEY` is present, mapped sports (football, basketball, ice hockey, cricket, tennis) are fetched from The Odds API and normalized into the same types the rest of the app already uses. If the key is missing, the sport has no free-tier mapping, or the live request fails, the mock adapter serves fixtures from `src/data/sportsbook-mock-data.json` and a client-side simulator ticks live prices.

The sportsbook never branches on “live vs mock” in the board, slip, or ticket UI. That split lives in the adapter.

Bet placement is simulated for demonstration purposes. Tickets are persisted through a lightweight local API (`POST` / `GET` `/api/bets`) to demonstrate the complete frontend workflow without requiring authentication, payments, or a production wagering backend.

```
src/
├── app/                 # Routes and HTTP APIs
├── features/
│   ├── sportsbook/      # Lobby, events, live/mock query layer
│   ├── bet-slip/        # Slip, placement, open tickets
│   └── responsible-gambling/
├── lib/
│   ├── odds-api/        # External odds client + mapper
│   └── bets/            # Ticket schema and local persistence
├── stores/              # Zustand client state
├── components/          # Shared UI
└── types/               # Shared domain types
```

## Technical decisions

The stack is intentionally small. Two kinds of state are kept apart on purpose:

```
Server state                          Client state
events · markets · odds · live        selected bets · stakes · bet slip
        ↓                                      ↓
 TanStack Query                             Zustand
```

TanStack Query owns cache, freshness, and polling. Zustand owns the slip: toggle selections, singles vs accumulator, and max-leg limits. React Hook Form + Zod handle stake input — required value, two decimal places, and min/max bounds — then `calculateReturns` previews payout before confirm.

Live boards poll; they do not open a socket. Mock live events tick every 1–3s; a configured Odds API feed refreshes on a longer interval to respect free-tier quota. Only changed events get new object references, `EventRow` is memoized, and each `OddsButton` flashes on its own price move (`1.85 → 1.92`) so a frequently updating board does not rerender the entire sportsbook.

## Testing

Testing is part of the product, not an afterthought. The suite covers the assignment-critical behaviors rather than asserting that the page “renders.”

**Unit / component (Vitest + Testing Library)**

- Odds selection: add on first toggle, remove on second, multiple legs, max-selection cap
- Bet-slip state: remove one leg, clear the slip, switch singles / accumulator
- Stake validation: required, non-numeric, min/max bounds, two decimal places
- Payout-facing UI: event, market, odds, and remove action on a slip card
- Live price UX: flash green on shorten, red on drift, no flash when unchanged or selected

**End-to-end (Playwright)**

Lobby → football board → select odds → enter stake → place bet → confirm → success

| Command | What it runs |
| --- | --- |
| `pnpm test` | Vitest |
| `pnpm test:watch` | Vitest (watch) |
| `pnpm test:e2e` | Playwright |
| `pnpm test:e2e:ui` | Playwright UI |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm format:check` | Prettier |

## Setup

Node.js 20+ and [pnpm](https://pnpm.io). No API key is required.

```bash
pnpm install
cp .env.example .env.local   # optional: THE_ODDS_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Use `localhost`, not `127.0.0.1` — Next.js treats them as different origins, which can break HMR and hydration.

To follow live prices instead of the simulator, add a free key from [the-odds-api.com](https://the-odds-api.com) to `.env.local`. Without it, mock data and simulated prices stay on.
