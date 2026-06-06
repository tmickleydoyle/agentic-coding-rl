export function GET() { return Response.json([]); }
export async function POST(_req: Request) { return Response.json({}, { status: 201 }); }
export async function PATCH(_req: Request) { return Response.json({ ok: true }); }
export async function DELETE(_req: Request) { return Response.json({ ok: true }); }
