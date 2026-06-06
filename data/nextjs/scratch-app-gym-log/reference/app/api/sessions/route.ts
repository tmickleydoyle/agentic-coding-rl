import { getSessions, addSession } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getSessions());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, date } = body;
  const session = addSession(name, date);
  if (!session) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
  return Response.json(session, { status: 201 });
}
