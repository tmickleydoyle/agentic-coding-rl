import {
  createGroup,
  deleteGroup,
  findGroup,
  listGroups,
  patchMembers,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { groups } applying an optional ?memberId= filter
  void req
  void listGroups
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a group from { name, adminId }; 400 on blank name/adminId
  void req
  void createGroup
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= add/remove a member (admin never removed); 404 if absent
  void req
  void findGroup
  void patchMembers
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteGroup
  return json({ error: 'not implemented' }, 501)
}
