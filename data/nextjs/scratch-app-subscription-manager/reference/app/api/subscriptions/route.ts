import { getSubscriptions, addSubscription, toggleStatus, deleteSubscription } from '../../../lib/store';

export function GET() {
  return Response.json(getSubscriptions());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, monthlyCost, billingDay, category, status } = body;
  if (!name || !category || Number(monthlyCost) <= 0 || Number(billingDay) < 1 || Number(billingDay) > 31) {
    return Response.json({ error: 'Invalid data' }, { status: 400 });
  }
  const s = addSubscription({ name, monthlyCost: Number(monthlyCost), billingDay: Number(billingDay), category, status: status || 'active' });
  return Response.json(s, { status: 201 });
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  toggleStatus(id);
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deleteSubscription(id);
  return Response.json({ ok: true });
}
