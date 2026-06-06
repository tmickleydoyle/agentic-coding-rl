import { getProposals, createProposal } from '../../../lib/store';

export function GET() { return Response.json(getProposals()); }

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, author, category } = body;
  if (!title || !description || !author || !category) return Response.json({ error: 'Missing required fields' }, { status: 400 });
  const proposal = createProposal({ title, description, author, category });
  return Response.json({ proposal }, { status: 201 });
}
