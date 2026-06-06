export async function GET(_request: Request): Promise<Response> {
  return Response.json({ entries: [], goal: { dailyTarget: 10000 }, stats: { totalSteps: 0, avgSteps: 0, goalMetDays: 0, bestDay: null } });
}

export async function POST(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function DELETE(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function PUT(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}
