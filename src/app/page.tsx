import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowDown, LineChart, Ticket, Zap } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import {
  SportsLobby,
  SportsLobbySkeleton,
} from '@/features/sportsbook/sports-lobby';
import { getBoardStats } from '@/features/sportsbook/api';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    icon: Zap,
    title: 'Follow live lines',
    body: 'Open a sport and watch prices shorten or drift as the match moves.',
  },
  {
    icon: Ticket,
    title: 'Build your slip',
    body: 'Tap odds to add legs, set a stake, and preview returns instantly.',
  },
  {
    icon: LineChart,
    title: 'Confirm with clarity',
    body: 'Review the ticket, place the bet, and keep responsible limits in view.',
  },
] as const;

async function StayInControl() {
  const stats = await getBoardStats();

  const kpis = [
    { label: 'Live events', value: stats.live },
    { label: 'Upcoming', value: stats.upcoming },
    { label: 'Open markets', value: stats.markets },
    { label: 'Sports covered', value: stats.sports },
  ] as const;

  return (
    <section
      className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20"
      aria-labelledby="control-heading"
    >
      <div className="flex flex-col gap-8 border-l-2 border-lime-400/70 pl-4 sm:pl-5">
        <div className="flex flex-col gap-3">
          <h2
            id="control-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Stay in control
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Oddsline keeps session time and responsible gambling resources
            visible while you bet. Use the slip for decisions — not impulse.
          </p>
        </div>

        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="flex flex-col gap-1">
              <dt className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {kpi.label}
              </dt>
              <dd className="text-3xl font-semibold tracking-tight tabular-nums">
                {kpi.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate min-h-[78vh] overflow-hidden border-b border-border">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-end gap-6 px-6 pb-16 pt-32 sm:px-8 sm:pb-20">
          <p className="text-sm font-semibold tracking-[0.22em] text-lime-300 uppercase">
            Oddsline
          </p>
          <div className="flex max-w-2xl flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              Read the line.
              <span className="block text-lime-300">Ride the move.</span>
            </h1>
            <p className="max-w-xl text-base text-white/75 sm:text-lg">
              A focused sportsbook workspace for live markets — sharp prices,
              one slip, and less noise between you and the board.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#markets"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-lime-400 text-black hover:bg-lime-300',
              )}
            >
              Browse markets
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <Link
              href="/sport/football"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'border-white/25 bg-black/20 text-white hover:bg-black/35 hover:text-white',
              )}
            >
              Open football
            </Link>
          </div>
        </div>
      </section>

      <section
        id="markets"
        className="scroll-mt-24 border-y border-lime-400/20 bg-lime-400/[0.07]"
        aria-labelledby="markets-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-lime-600 uppercase dark:text-lime-300">
              Main board
            </p>
            <h2
              id="markets-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Markets
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              This is the core of Oddsline. Pick a sport to enter the live
              board, follow prices as they move, and start building your slip.
            </p>
          </div>
          <Suspense fallback={<SportsLobbySkeleton />}>
            <SportsLobby />
          </Suspense>
        </div>
      </section>

      <section
        className="border-y border-border bg-muted/25"
        aria-labelledby="workflow-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="mb-10 flex max-w-2xl flex-col gap-2">
            <h2
              id="workflow-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Built like a tool, not a brochure
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Three moves from board to ticket — designed for people who
              actually watch the odds.
            </p>
          </div>

          <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-lime-400/15 text-lime-600 dark:text-lime-300">
                    <step.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
            <div className="h-40 animate-pulse rounded-xl bg-muted/40" />
          </section>
        }
      >
        <StayInControl />
      </Suspense>
    </main>
  );
}
