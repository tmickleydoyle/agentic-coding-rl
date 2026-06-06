import { getWorkouts, addWorkout } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getWorkouts());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, type, duration } = body;
  const workout = addWorkout(name, type, Number(duration));
  if (!workout) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
  return Response.json(workout, { status: 201 });
}
