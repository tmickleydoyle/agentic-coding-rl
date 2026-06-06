import { getMeals, addMeal } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  return Response.json(getMeals());
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, time } = body;
  const meal = addMeal(name, time);
  if (!meal) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
  return Response.json(meal, { status: 201 });
}
