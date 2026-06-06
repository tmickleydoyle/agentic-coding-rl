import { getInjuries, addInjury } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getInjuries());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { bodyPart, type, severity, date } = body;
  const injury = addInjury(bodyPart, type, severity, date);
  if (!injury) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
  return Response.json(injury, { status: 201 });
}
