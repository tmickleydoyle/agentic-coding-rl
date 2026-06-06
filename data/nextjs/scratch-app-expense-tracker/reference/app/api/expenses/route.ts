import { getExpenses, addExpense, deleteExpense } from '../../../lib/store';

export async function GET() {
  return Response.json(getExpenses());
}

export async function POST(request: Request) {
  const body = await request.json();
  const { description, amount, category, date } = body;
  if (!description || typeof description !== 'string' || !description.trim()) {
    return Response.json({ error: 'Description required' }, { status: 400 });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return Response.json({ error: 'Amount must be positive' }, { status: 400 });
  }
  if (!category) {
    return Response.json({ error: 'Category required' }, { status: 400 });
  }
  const expense = addExpense({ description: description.trim(), amount, category, date: date ?? new Date().toISOString().slice(0, 10) });
  return Response.json(expense, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const ok = deleteExpense(id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
