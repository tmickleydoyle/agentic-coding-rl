export function GET() { return Response.json({ pages: [] }); }
export async function POST(_req: Request) { return Response.json({ error: "not implemented" }, { status: 501 }); }
