export async function GET(_req: Request): Promise<Response> { return Response.json({ invoices: [], clients: [] }) }
export async function POST(_req: Request): Promise<Response> { return new Response(JSON.stringify({ error: 'Not implemented' }), { status: 400 }) }
