import { NextResponse } from 'next/server';

import {
  getCompetitionsBySport,
  getEventsBySport,
  getSportBySlug,
  isLiveOddsSource,
} from '@/features/sportsbook/api';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const sport = await getSportBySlug(slug);

  if (!sport) {
    return NextResponse.json({ error: 'Sport not found' }, { status: 404 });
  }

  const [events, competitions] = await Promise.all([
    getEventsBySport(sport.id),
    getCompetitionsBySport(sport.id),
  ]);

  return NextResponse.json({
    source: isLiveOddsSource(sport.slug) ? 'odds-api' : 'mock',
    sport,
    events,
    competitions,
  });
}
