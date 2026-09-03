# Oddsline

A sportsbook front-end built for real operators — not a pile of disconnected components.

Oddsline covers the path players actually take: find a market, follow the line, build a slip, place the bet, and check open tickets. It’s meant to be something a product team can demo tomorrow and an engineering team can wire into a real stack without rewriting the UI.

---

## What you get

**A complete betting surface.** Sports lobby, live and upcoming boards, bet slip, confirmation, and open bets — end to end.

**A slip that works on phones.** Drawer UI, stake limits, clear returns, and a confirm step so people don’t fat-finger a ticket.

**Odds you can actually feed.** Plug in [The Odds API](https://the-odds-api.com) for live prices, or keep the demo feed with simulated movement for sales calls and QA.

**Player protection that stays visible.** Session timing and responsible-gambling prompts sit alongside the board, not buried in a footer.

**Clean seams for your backend.** Odds and bets go through adapters. Swap the demo store for your wallet, risk, or settlement service when you’re ready — the UI doesn’t need to change.

---

## Screenshots

### Desktop event board

![Desktop live events](docs/screenshots/desktop.png)

### Mobile bet slip

![Mobile bet slip](docs/screenshots/mobile-bet-slip.png)

---

## How it’s put together

Most of the first paint comes from the server. The client handles the lively parts: odds polling, the slip, theme, and timers.

| Layer | Job |
| --- | --- |
| Server Components | Lobby and sport boards on first load |
| TanStack Query | Live odds, open bets, cache freshness |
| Zustand | Slip, theme, UI chrome |
| Odds adapter | The Odds API, or mock data + simulator |
| Bets adapter | Place and list tickets via `/api/bets` |

```
src/
├── app/                 # Routes and HTTP APIs
├── features/
│   ├── sportsbook/      # Lobby, events, odds simulation
│   ├── bet-slip/        # Slip, placement, open bets
│   └── responsible-gambling/
├── lib/
│   ├── odds-api/        # External odds provider
│   └── bets/            # Ticket schema and persistence
├── components/          # Shared UI
└── types/
```

More on shared components: [`src/components/shared/README.md`](src/components/shared/README.md)

---

## Try it locally

You’ll need Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Use `localhost`, not `127.0.0.1` — Next.js treats them as different origins, which can mess with HMR and hydration.

### Live odds (optional)

1. Grab a key from [the-odds-api.com](https://the-odds-api.com).
2. Put it in `.env.local` as `THE_ODDS_API_KEY`.
3. Restart the server.

| Market in Oddsline | Feed |
| --- | --- |
| Football | EPL |
| Basketball | NBA |
| Ice hockey | NHL |
| Cricket | International T20 |
| Tennis | ATP |
| Esports | Demo catalog |

No key? Everything runs on the demo catalog with simulated odds. Fine for demos and tests.

### Bets

- `POST /api/bets` — validate and place a ticket  
- `GET /api/bets` — load open bets in the slip drawer  

Tickets land in `data/bets-store.json` for local demos. That file store is intentional and temporary — replace it with your real ledger when you integrate.

---

## Stack

Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod, Vitest, Playwright, pnpm.

React Compiler is on. We still memo some odds-heavy rows so live boards stay smooth.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run locally |
| `pnpm build` / `pnpm start` | Production build |
| `pnpm typecheck` | TypeScript |
| `pnpm lint` / `pnpm format` | Lint and format |
| `pnpm test` | Unit tests |
| `pnpm test:e2e` | Critical path: lobby → place bet |

Tests focus on the stuff that breaks trust: odds button states, stake limits, slip changes, and the full place-bet flow.

---

## Where this goes next

Common next steps for operator teams:

- Point bets at your wallet / risk / settlement APIs  
- Feed odds from your own trading stack (or multiple books)  
- White-label themes and domains for partners  
- Add markets beyond match winner — totals, handicaps, player props  

---

## License

Private evaluation build. For licensing, white-label work, or help integrating — open an issue or get in touch.
