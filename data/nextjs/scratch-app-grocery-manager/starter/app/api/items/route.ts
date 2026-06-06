export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ items: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({}), { status: 201, headers: { "Content-Type": "application/json" } });
}
