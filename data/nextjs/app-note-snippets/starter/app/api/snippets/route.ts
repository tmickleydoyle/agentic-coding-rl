import {
  createSnippet,
  deleteSnippet,
  findSnippet,
  listSnippets,
  updateSnippet,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { snippets } applying ?language=, ?favorite=, ?q= filters
  void req
  void listSnippets
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a snippet from { title, language, code? }; 400 if title/language blank
  void req
  void createSnippet
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= patch (copy:true increments copyCount); 404 if absent
  void req
  void findSnippet
  void updateSnippet
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteSnippet
  return json({ error: 'not implemented' }, 501)
}
