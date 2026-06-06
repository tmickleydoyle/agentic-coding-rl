export async function GET(_request: Request): Promise<Response> {
  return Response.json({ entries: [], insights: { avgDuration: 0, avgQuality: 0, bestNight: null, worstNight: null } });
}

export async function POST(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function DELETE(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}
