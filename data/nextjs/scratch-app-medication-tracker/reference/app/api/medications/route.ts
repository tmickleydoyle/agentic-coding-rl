import { getMedications, addMedication, deleteMedication, toggleMedication, getDoseLogs, logDose } from "../../../lib/store";
import type { Frequency } from "../../../lib/types";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ medications: getMedications(), logs: getDoseLogs() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { name: string; dosage: string; frequency: Frequency; instructions: string };
  if (!body.name || !body.dosage) {
    return new Response(JSON.stringify({ error: "name and dosage required" }), { status: 400 });
  }
  const med = addMedication(body);
  return Response.json({ medication: med }, { status: 201 });
}

export async function PATCH(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  const med = toggleMedication(id);
  if (!med) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return Response.json({ medication: med });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  const ok = deleteMedication(id);
  if (!ok) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return Response.json({ success: true });
}

export async function PUT(request: Request): Promise<Response> {
  const body = await request.json() as { medicationId: string; note: string };
  if (!body.medicationId) return new Response(JSON.stringify({ error: "medicationId required" }), { status: 400 });
  const log = logDose(body);
  if (!log) return new Response(JSON.stringify({ error: "medication not found" }), { status: 404 });
  return Response.json({ log }, { status: 201 });
}
