# Oddsline

A modern sportsbook UI demo with a sports lobby, live events, simulated real-time odds, a full bet slip flow, theme switching, and responsible gambling UI.

Built with Next.js App Router, React 19, TypeScript, TanStack Query, and Zustand.

## Screenshots

### Live events on desktop

![Desktop live events](docs/screenshots/desktop.png)

### Bet slip on mobile

![Mobile bet slip](docs/screenshots/mobile-bet-slip.png)

## Features

* Sports lobby with server-rendered sports data
* Sport pages with live and upcoming events
* Simulated real-time odds updates
* Odds change animations (shorten / drift)
* Bet slip with add/remove selections
* Stake validation
* Bet confirmation flow
* Success notifications
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
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Use `localhost` instead of `127.0.0.1` locally — Next treats them as different origins, which can cause HMR/hydration issues.

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
├── app/                       # Next.js routes (thin layer)
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── shared/                # Reusable product components
│   └── providers/             # App providers
├── features/
│   ├── sportsbook/            # Sports data, events, odds simulator
│   ├── bet-slip/              # Bet slip flow
│   ├── layout/                # Header and layout
│   └── responsible-gambling/  # RG banner and session timer
├── stores/                    # Zustand stores
├── lib/                       # Helpers and schemas
├── types/                     # Shared TypeScript types
└── data/                      # Mock sportsbook data
```

Shared component docs: `src/components/shared/README.md`

## Architecture

### Server vs client

Server Components fetch and render the lobby and initial sport-page data. Client Components handle live polling, bet slip interactions, theme, timers, and animations — keeping most of the first paint on the server.

### Mock API

Data lives in `src/data/sportsbook-mock-data.json` and is accessed through async helpers in `src/features/sportsbook/api.ts`, so swapping in a real backend later only changes that layer.

### Live odds

Odds updates are simulated on the client. TanStack Query polls every 1–3 seconds when live events exist. The simulator only creates new object references for events that change; combined with `React.memo`, unchanged rows skip re-renders.

### State management

| Tool              | Responsibility                 |
| ----------------- | ------------------------------ |
| Server Components | Initial sports and event data  |
| TanStack Query    | Live events, polling and cache |
| Zustand           | Bet slip, theme and UI state   |

## Testing

Tests focus on regression-prone areas rather than coverage for its own sake.

**Unit:** OddsButton states and flash rules, bet slip store, stake validation, BetSlipCard remove.

**E2E:** Lobby → football → select odds → stake → place bet → confirm → success toast.
