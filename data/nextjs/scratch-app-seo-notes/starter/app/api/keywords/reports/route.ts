export function GET() { return Response.json({ reports: [] }); }
export function POST() { return Response.json({ error: "not implemented" }, { status: 501 }); }
