import {
  createUser,
  deleteUser,
  findUser,
  listUsers,
  updateUser,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { users } applying an optional ?q= name filter
  void req
  void listUsers
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a user from { name, bio? }; 400 if name blank
  void req
  void createUser
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= update name/bio; 400 if name present-but-blank; 404 if absent
  void req
  void findUser
  void updateUser
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteUser
  return json({ error: 'not implemented' }, 501)
}
