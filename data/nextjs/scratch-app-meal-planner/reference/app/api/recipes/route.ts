import { getRecipes, addRecipe, deleteRecipe } from '../../../lib/store';

export function GET(): Response {
  return Response.json({ recipes: getRecipes() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, ingredients, servings, prepMinutes, tags } = body;
  try {
    const recipe = addRecipe(name, ingredients ?? [], Number(servings) || 1, Number(prepMinutes) || 0, tags ?? []);
    return Response.json({ recipe }, { status: 201 });
  } catch (e: unknown) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}

export function DELETE(req: Request): Response {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  deleteRecipe(id);
  return Response.json({ ok: true });
}
