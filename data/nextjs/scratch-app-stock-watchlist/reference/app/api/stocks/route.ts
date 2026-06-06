import { getStocks, addStock, deleteStock } from '../../../lib/store';

export function GET(): Response {
  return Response.json({ stocks: getStocks() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { ticker, name, price, quantity, currency } = body;
  try {
    const stock = addStock(ticker, name, Number(price), Number(quantity), currency ?? 'USD');
    return Response.json({ stock }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteStock(id);
  return Response.json({ ok: true });
}
