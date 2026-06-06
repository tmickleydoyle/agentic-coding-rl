import { getRecipes, addRecipe, getIngredients, addIngredient } from '../../../lib/store'

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  if (url.pathname.endsWith('/ingredients')) {
    return Response.json({ ingredients: getIngredients() })
  }
  return Response.json({ recipes: getRecipes() })
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const body = await req.json()

  if (url.pathname.endsWith('/ingredients')) {
    const { name, quantity } = body
    if (!name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400 })
    const ingredient = addIngredient({ name, quantity: quantity ?? '' })
    return Response.json(ingredient, { status: 201 })
  }

  const { name, description, ingredients } = body
  if (!name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400 })
  const recipe = addRecipe({ name, description: description ?? '', ingredients: ingredients ?? [] })
  return Response.json(recipe, { status: 201 })
}
