export function GET() {
  return Response.json({ goals: [] });
}

export async function POST(_req: Request) {
  return Response.json({ error: "not implemented" }, { status: 501 });
}

export async function PATCH(_req: Request) {
  return Response.json({ error: "not implemented" }, { status: 501 });
}
