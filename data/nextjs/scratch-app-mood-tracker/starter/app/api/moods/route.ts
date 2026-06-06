export async function GET(_request: Request): Promise<Response> {
  return Response.json({ logs: [], average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
}

export async function POST(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function DELETE(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}
