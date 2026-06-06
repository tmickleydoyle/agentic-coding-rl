import { getVolunteers, addVolunteer } from "../../../lib/store";
import type { VolunteerStatus } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getVolunteers());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as { name: string; skills: string[]; status?: VolunteerStatus };
  if (!body.name) {
    return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
  }
  const v = addVolunteer(body.name, body.skills ?? [], body.status ?? "Active");
  return new Response(JSON.stringify(v), { status: 201 });
}
