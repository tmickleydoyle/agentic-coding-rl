import { getExchanges, addExchange } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getExchanges());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const ex = addExchange(body);
  return Response.json(ex, { status: 201 });
}
