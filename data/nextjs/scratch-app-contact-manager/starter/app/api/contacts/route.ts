export async function GET(_request: Request) { return Response.json([]); }
export async function POST(_request: Request) { return Response.json({ error: 'Not implemented' }, { status: 501 }); }
export async function DELETE(_request: Request) { return Response.json({ error: 'Not implemented' }, { status: 501 }); }
