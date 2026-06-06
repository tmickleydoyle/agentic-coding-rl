import { getPolls, createPoll } from '../../../lib/store';

export function GET() { return Response.json(getPolls()); }

export async function POST(req: Request) {
  const body = await req.json();
  const { question, creator, options } = body;
  if (!question || !creator || !options || options.length < 2) {
    return Response.json({ error: 'Missing required fields or fewer than 2 options' }, { status: 400 });
  }
  const poll = createPoll({ question, creator, options });
  return Response.json({ poll }, { status: 201 });
}
