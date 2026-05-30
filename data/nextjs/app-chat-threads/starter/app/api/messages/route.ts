import {
  createMessage,
  deleteMessage,
  findMessage,
  listMessages,
  setResolved,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { messages } applying an optional ?resolved=true|false filter
  void req
  void listMessages
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a message from { authorId, text }; 400 on blank authorId/text
  void req
  void createMessage
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set/toggle resolved; 404 if absent
  void req
  void findMessage
  void setResolved
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteMessage
  return json({ error: 'not implemented' }, 501)
}
