import { getMentors, addMentor } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify(getMentors()), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, specialty, email } = body;
  if (!name || !specialty || !email) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }
  const mentor = addMentor({ name, specialty, email });
  return new Response(JSON.stringify(mentor), { status: 201, headers: { "Content-Type": "application/json" } });
}
