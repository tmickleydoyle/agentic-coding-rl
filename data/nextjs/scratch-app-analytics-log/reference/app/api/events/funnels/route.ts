import { getFunnels, addFunnel } from "../../../../lib/store";

export function GET() { return Response.json({ funnels: getFunnels() }); }

export async function POST(req: Request) {
  const body = await req.json();
  const result = addFunnel(body);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ funnel: result }, { status: 201 });
}
