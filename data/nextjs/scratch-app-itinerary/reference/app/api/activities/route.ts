import { getActivities, addActivity } from "../../../lib/store";

export function GET(): Response {
  return Response.json(getActivities());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const activity = addActivity(body);
  return Response.json(activity, { status: 201 });
}
