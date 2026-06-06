import { getReadings, addReading, deleteReading, getAverages } from "../../../lib/store";

export async function GET(_request: Request): Promise<Response> {
  return Response.json({ readings: getReadings(), averages: getAverages() });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json() as { date: string; time: string; systolic: number; diastolic: number; pulse: number; note: string };
  if (!body.systolic || body.systolic <= 0 || !body.diastolic || body.diastolic <= 0) {
    return new Response(JSON.stringify({ error: "systolic and diastolic required" }), { status: 400 });
  }
  const reading = addReading(body);
  return Response.json({ reading }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  const ok = deleteReading(id);
  if (!ok) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return Response.json({ success: true });
}
