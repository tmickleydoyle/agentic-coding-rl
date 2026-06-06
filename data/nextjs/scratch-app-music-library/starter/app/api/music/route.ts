export async function GET(_req: Request): Promise<Response> { return Response.json({ tracks: [], queue: [] }) }
export async function POST(_req: Request): Promise<Response> { return new Response(JSON.stringify({ error: 'Not implemented' }), { status: 400 }) }
export async function DELETE(_req: Request): Promise<Response> { return Response.json({ success: false }) }
