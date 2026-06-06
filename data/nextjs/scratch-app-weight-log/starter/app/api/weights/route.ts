export async function GET(_request: Request): Promise<Response> {
  return Response.json({ entries: [], stats: { min: 0, max: 0, avg: 0, change: 0 } });
}

export async function POST(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function DELETE(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}
