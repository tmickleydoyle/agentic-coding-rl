import {
  createChat,
  deleteChat,
  findChat,
  listChats,
  updateChat,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { chats } applying an optional ?status=open|closed filter
  void req
  void listChats
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a chat from { customer }; 400 on blank customer
  void req
  void createChat
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= apply status/agentId patch; 404 if absent
  void req
  void findChat
  void updateChat
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteChat
  return json({ error: 'not implemented' }, 501)
}
