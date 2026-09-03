import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getCompetitionsBySport,
  getEventsBySport,
  getSportBySlug,
} from '@/features/sportsbook/api';
import { EventsList } from '@/features/sportsbook/events-list';

interface SportPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SportPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);

  return {
    title: sport ? `${sport.name} — Sportsbook` : 'Sportsbook',
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

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {sport.icon}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">{sport.name}</h1>
      </div>
      <EventsList
        sportId={sport.id}
        initialEvents={events}
        competitions={competitions}
      />
    </main>
  );
}
