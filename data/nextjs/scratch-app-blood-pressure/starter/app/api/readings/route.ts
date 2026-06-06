export async function GET(_request: Request): Promise<Response> {
  return Response.json({ readings: [], averages: { systolic: 0, diastolic: 0, pulse: 0 } });
}

export async function POST(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}

export async function DELETE(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ error: "Not implemented" }), { status: 501 });
}
