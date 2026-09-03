import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import {
  getCompetitionsBySport,
  getEventsBySport,
  getSportBySlug,
} from '@/features/sportsbook/api';
import { EventsList } from '@/features/sportsbook/events-list';

interface SportPageProps {
  params: Promise<{ slug: string }>;
}

const SPORT_BACKGROUNDS: Record<string, string> = {
  football: '/sports/football.jpg',
  basketball: '/sports/basketball.jpg',
  tennis: '/sports/tennis.jpg',
  'ice-hockey': '/sports/ice-hockey.jpg',
  cricket: '/sports/cricket.jpg',
  esports: '/sports/esports.jpg',
};

export async function generateMetadata({
  params,
}: SportPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);

  return {
    title: sport ? `${sport.name} — Oddsline` : 'Oddsline',
  };
}

export default async function SportPage({ params }: SportPageProps) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);

  if (!sport) {
    notFound();
  }

  const [events, competitions] = await Promise.all([
    getEventsBySport(sport.id),
    getCompetitionsBySport(sport.id),
  ]);

  const background =
    SPORT_BACKGROUNDS[sport.slug] ?? SPORT_BACKGROUNDS.football;
  const liveCount = events.filter((event) => event.status === 'live').length;

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden border-b border-border">
        <Image
          src={background}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
          <Link
            href="/#markets"
            className="inline-flex w-fit items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            All markets
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-3xl ring-1 ring-white/15 backdrop-blur"
                aria-hidden="true"
              >
                {sport.icon}
              </span>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {sport.name}
                </h1>
                <p className="text-sm text-white/65">
                  {liveCount > 0
                    ? `${liveCount} live right now · odds updating`
                    : 'Upcoming fixtures · lines ready'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <EventsList
          sportId={sport.id}
          initialEvents={events}
          competitions={competitions}
        />
      </div>
    </main>
  );
}
