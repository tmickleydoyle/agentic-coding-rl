export function GET() { return Response.json({ copies: [] }); }
export async function POST(_req: Request) { return Response.json({ error: "not implemented" }, { status: 501 }); }
