import { getScores, addScore } from '../../../lib/store';

export function GET(): Response {
  return Response.json({ scores: getScores() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, wpm, accuracy, date } = body;
  const score = addScore(name, Number(wpm), Number(accuracy), date);
  return Response.json({ score }, { status: 201 });
}
