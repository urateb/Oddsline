# Shared components

Reusable product UI used across features. Each component exports a `*Props` TypeScript interface (no `any`) with JSDoc on every prop.

## `OddsButton`

Displays a selection’s label (`1` / `X` / `2` or Over/Under) and decimal odds.
Handles selected state, flashes green when odds shorten and red when they drift,
and shows a locked/disabled state while the market is suspended. Flash is
suppressed while selected.

| Prop         | Type         | Description                                          |
| ------------ | ------------ | ---------------------------------------------------- |
| `label`      | `string`     | Short selection label, e.g. `"1"`, `"X"`, `"Over"`.  |
| `odds`       | `number`     | Current decimal odds.                                |
| `isSelected` | `boolean?`   | Whether this selection is currently in the bet slip. |
| `suspended`  | `boolean?`   | Disables the button and shows a lock icon.           |
| `onToggle`   | `() => void` | Called on click; never called while suspended.       |
| `aria-label` | `string?`    | Overrides the default generated label.               |
| `className`  | `string?`    | Layout overrides.                                    |

## `EventRow`

Displays a single event: teams, live score/period or start time, and main-market
odds as clickable `OddsButton`s. Responsive (stacks on mobile, row on `sm+`).
Memoized so only rows whose event data changed re-render under odds polling.

| Prop        | Type      | Description       |
| ----------- | --------- | ----------------- |
| `event`     | `Event`   | Event to render.  |
| `className` | `string?` | Layout overrides. |

## `SportCard`

Displays a sport’s icon, name, and live/upcoming event counts. Built on
shadcn/ui `Card`. Links to `/sport/[slug]`.

| Prop        | Type      | Description       |
| ----------- | --------- | ----------------- |
| `sport`     | `Sport`   | Sport to render.  |
| `className` | `string?` | Layout overrides. |

## `BetSlipCard`

Displays a single bet-slip selection: event name, selection, market, odds, and
a remove action (shadcn/ui `Button`).

| Prop        | Type               | Description                               |
| ----------- | ------------------ | ----------------------------------------- |
| `selection` | `BetSlipSelection` | Selection to display.                     |
| `onRemove`  | `() => void`       | Called when the remove button is clicked. |
| `className` | `string?`          | Layout overrides.                         |

## `MatchClock`

Live match time/period with a pulsing live indicator dot when `isRunning`.

| Prop        | Type      | Description                                               |
| ----------- | --------- | --------------------------------------------------------- |
| `minute`    | `number`  | Running minute; `0` for sports without one (e.g. tennis). |
| `period`    | `string`  | Period indicator, e.g. `"2H"`, `"Set 3"`.                 |
| `isRunning` | `boolean` | Drives the pulsing live dot.                              |
| `className` | `string?` | Layout overrides.                                         |

## `OddslineLogo`

Brand mark (O + odds sparkline). Use alone with `title`, or next to the
wordmark with no `title` so it stays decorative.

| Prop        | Type      | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| `size`      | `number?` | Width/height in pixels (default `28`).           |
| `title`     | `string?` | Accessible name when the logo is used alone.     |
| `className` | `string?` | Layout overrides.                                |

## Other shared helpers

| Component           | Notes                                                           |
| ------------------- | --------------------------------------------------------------- |
| `SportCardSkeleton` | Loading placeholder for `SportCard` (no props).                 |
| `ThemeToggle`       | Light/dark toggle backed by the Zustand theme store (no props). |
