import { getLinks, createLink } from '../../../lib/store';

export function GET() { return Response.json(getLinks()); }

export async function POST(req: Request) {
  const body = await req.json();
  const { title, url, submitter, category } = body;
  if (!title || !url || !submitter || !category) return Response.json({ error: 'Missing required fields' }, { status: 400 });
  const link = createLink({ title, url, submitter, category });
  return Response.json({ link }, { status: 201 });
}
