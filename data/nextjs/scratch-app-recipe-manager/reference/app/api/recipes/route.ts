import { getRecipes, addRecipe } from "../../../lib/store";
import { Recipe } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  const recipes = getRecipes();
  return new Response(JSON.stringify({ recipes }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json() as Omit<Recipe, "id" | "createdAt">;
  const recipe = addRecipe(body);
  return new Response(JSON.stringify(recipe), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
