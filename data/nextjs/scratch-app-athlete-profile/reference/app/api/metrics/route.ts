import { getMetrics, addMetric } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getMetrics());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { date, weight, height, vo2max } = body;
  const metric = addMetric(date, Number(weight), Number(height), Number(vo2max));
  if (!metric) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
  return Response.json(metric, { status: 201 });
}
