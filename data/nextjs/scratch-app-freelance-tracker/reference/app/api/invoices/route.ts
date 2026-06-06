import { getInvoices, addInvoice, payInvoice, deleteInvoice } from '../../../lib/store';

export function GET() {
  return Response.json(getInvoices());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { projectId, amount, dueDate } = body;
  if (!projectId || !dueDate) {
    return Response.json({ error: 'projectId and dueDate required' }, { status: 400 });
  }
  const inv = addInvoice({ projectId, amount: Number(amount) || 0, dueDate });
  return Response.json(inv, { status: 201 });
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  payInvoice(id);
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  deleteInvoice(id);
  return Response.json({ ok: true });
}
