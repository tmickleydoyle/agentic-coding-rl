import { getScores, submitScore } from '../../../lib/store';

export function GET() { return Response.json(getScores()); }

export async function POST(req: Request) {
  const body = await req.json();
  const { player, game, score } = body;
  if (!player || !game) return Response.json({ error: 'Missing required fields' }, { status: 400 });
  if (typeof score !== 'number' || score < 0) return Response.json({ error: 'Invalid score' }, { status: 400 });
  const s = submitScore({ player, game, score });
  return Response.json({ score: s }, { status: 201 });
}
