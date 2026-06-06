import { getExperiments, addExperiment } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getExperiments());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { title, hypothesis, subject, startDate } = body;
  if (!title || !hypothesis || !subject || !startDate) {
    return Response.json({ error: "title, hypothesis, subject, startDate required" }, { status: 400 });
  }
  const e = addExperiment({ title, hypothesis, subject, status: "planned", startDate, endDate: body.endDate || "", observations: "", conclusion: "" });
  return Response.json(e, { status: 201 });
}
