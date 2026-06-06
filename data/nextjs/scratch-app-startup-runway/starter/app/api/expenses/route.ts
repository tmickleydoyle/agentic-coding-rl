export function GET(_req: Request): Response {
  return Response.json([]);
}

export async function POST(_req: Request): Promise<Response> {
  return Response.json({ error: "Not implemented" }, { status: 501 });
}

export async function PUT(_req: Request): Promise<Response> {
  return Response.json({ error: "Not implemented" }, { status: 501 });
}

export async function DELETE(_req: Request): Promise<Response> {
  return Response.json({ error: "Not implemented" }, { status: 501 });
}
