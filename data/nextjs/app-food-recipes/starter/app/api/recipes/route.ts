import {
  createRecipe,
  deleteRecipe,
  findRecipe,
  listRecipes,
  updateRecipe,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { recipes } applying ?cuisine= and ?favorite= filters
  void req
  void listRecipes
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a recipe from the body; 400 on blank title
  void req
  void createRecipe
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle favorite; 404 if absent
  void req
  void findRecipe
  void updateRecipe
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteRecipe
  return json({ error: 'not implemented' }, 501)
}
