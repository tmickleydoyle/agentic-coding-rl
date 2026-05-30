import {
  createNote,
  deleteNote,
  findNote,
  listNotes,
  renderNote,
  updateNote,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { notes } applying ?tag= and ?q= filters; ?render=html adds html
  void req
  void listNotes
  void renderNote
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a note from { title, body?, tags? }; 400 if title blank
  void req
  void createNote
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch; 404 if absent
  void req
  void findNote
  void updateNote
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteNote
  return json({ error: 'not implemented' }, 501)
}
