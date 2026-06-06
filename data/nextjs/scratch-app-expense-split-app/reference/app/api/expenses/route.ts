import { getExpenses, addExpense, deleteExpense } from '../../../lib/store';

export function GET(req: Request): Response {
  const url = new URL(req.url);
  const groupId = url.searchParams.get('groupId') ?? undefined;
  return Response.json({ expenses: getExpenses(groupId) });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { groupId, description, amount, paidBy, date } = body;
  try {
    const expense = addExpense(groupId, description, Number(amount), paidBy, date);
    return Response.json({ expense }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteExpense(id);
  return Response.json({ ok: true });
}
