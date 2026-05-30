import {
  createIssue,
  deleteIssue,
  findIssue,
  listIssues,
  updateIssue,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { issues } applying ?label= / ?priority= / ?assignee= filters
  void req
  void listIssues
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an issue from { title, labels?, priority?, assignee? }; 400 if title blank
  void req
  void createIssue
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= apply assignee/priority/status/labels; 404 if absent
  void req
  void findIssue
  void updateIssue
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteIssue
  return json({ error: 'not implemented' }, 501)
}
