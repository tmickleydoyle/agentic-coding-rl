export async function GET() { return Response.json([]); }
export async function POST(_request: Request) { return Response.json({ error: 'Not implemented' }, { status: 501 }); }
export async function PATCH(_request: Request) { return Response.json({ error: 'Not implemented' }, { status: 501 }); }
