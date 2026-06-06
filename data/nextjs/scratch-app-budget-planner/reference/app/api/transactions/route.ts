import { getTransactions, addTransaction, deleteTransaction } from '../../../lib/store';

export function GET(): Response {
  return Response.json({ transactions: getTransactions() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { description, amount, category, date } = body;
  try {
    const tx = addTransaction(description, Number(amount), category, date);
    return Response.json({ transaction: tx }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteTransaction(id);
  return Response.json({ ok: true });
}
