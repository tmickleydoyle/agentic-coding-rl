import {
  createProject,
  findProject,
  listPosts,
  listProjects,
  updateProject,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { projects, posts } applying ?featured= and ?tag= filters
  void req
  void listProjects
  void listPosts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a project from { title, tags? }; 400 if title blank
  void req
  void createProject
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= toggle/set featured; 404 if absent
  void req
  void findProject
  void updateProject
  return json({ error: 'not implemented' }, 501)
}
