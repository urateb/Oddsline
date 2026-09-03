import { NextResponse } from 'next/server';

import { createBet, listBets } from '@/lib/bets/store';
import { placeBetSchema } from '@/lib/bets/schema';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ bets: listBets() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = placeBetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid bet payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const bet = createBet(parsed.data);
  return NextResponse.json({ bet }, { status: 201 });
}
