import { getAllergies, addAllergy, deleteAllergy, getReactions, logReaction, getTriggerCounts } from "../../../lib/store";
import type { Severity, AllergyType } from "../../../lib/types";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ allergies: getAllergies(), reactions: getReactions(), triggers: getTriggerCounts() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { name: string; type: AllergyType; severity: Severity; symptoms: string[]; notes: string };
  if (!body.name) {
    return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
  }
  const allergy = addAllergy(body);
  return Response.json({ allergy }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  const ok = deleteAllergy(id);
  if (!ok) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return Response.json({ success: true });
}

export async function PUT(request: Request): Promise<Response> {
  const body = await request.json() as { allergyId: string; date: string; symptoms: string[]; severity: Severity; treatment: string };
  if (!body.allergyId || !body.date) {
    return new Response(JSON.stringify({ error: "allergyId and date required" }), { status: 400 });
  }
  const reaction = logReaction(body);
  if (!reaction) return new Response(JSON.stringify({ error: "allergy not found" }), { status: 404 });
  return Response.json({ reaction }, { status: 201 });
}
