import { getMeals, addMeal } from "../../../lib/store";
import { MealEntry } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify({ meals: getMeals() }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as Omit<MealEntry, "id">;
  const entry = addMeal(body);
  return new Response(JSON.stringify(entry), { status: 201, headers: { "Content-Type": "application/json" } });
}
