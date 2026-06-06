export function GET() { return Response.json({ posts: [] }); }
export async function POST(_req: Request) { return Response.json({ error: "not implemented" }, { status: 501 }); }
