export async function GET(_req: Request): Promise<Response> { return Response.json([]); }
export async function POST(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "not implemented" }), { status: 501 });
}
