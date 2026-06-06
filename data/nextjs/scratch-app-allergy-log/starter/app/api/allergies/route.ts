export async function GET(_request: Request): Promise<Response> {
  return Response.json({ allergies: [], reactions: [], triggers: {} });
}

export async function POST(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function DELETE(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function PUT(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}
