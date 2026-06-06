import { joinRoom } from '../../../../../lib/store';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { username } = body;
  if (!username) return Response.json({ error: 'Missing username' }, { status: 400 });
  const members = joinRoom(params.id, username);
  if (!members) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ members });
}
