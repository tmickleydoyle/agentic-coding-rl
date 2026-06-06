import { getRecipes, addRecipe, toggleFavorite, getIngredients } from '../../../lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  if (type === 'ingredients') return Response.json(getIngredients());
  if (type === 'favorites') return Response.json(getRecipes().filter(r => r.favorite));
  return Response.json(getRecipes());
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, cuisine, prepTime, ingredients, instructions } = body;
  if (!title || !title.trim()) return Response.json({ error: 'Title required' }, { status: 400 });
  if (!cuisine || !cuisine.trim()) return Response.json({ error: 'Cuisine required' }, { status: 400 });
  if (!instructions || !instructions.trim()) return Response.json({ error: 'Instructions required' }, { status: 400 });
  if (typeof prepTime !== 'number' || prepTime <= 0) return Response.json({ error: 'PrepTime must be positive' }, { status: 400 });
  const recipe = addRecipe({ title: title.trim(), cuisine: cuisine.trim(), prepTime, ingredients: ingredients ?? [], instructions: instructions.trim(), favorite: false });
  return Response.json(recipe, { status: 201 });
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const ok = toggleFavorite(id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
