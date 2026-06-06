export function GET() { return Response.json({ funnels: [] }); }
export async function POST(_req: Request) { return Response.json({ error: "not implemented" }, { status: 501 }); }
