import {
  createPoll,
  deletePoll,
  findPoll,
  listPolls,
  votePoll,
} from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { polls } applying ?sort=trending
  void req
  void listPolls
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a poll from { question, options }; 400 on blank question / <2 options
  void req
  void createPoll
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id=&optionId= vote once; 404 missing poll, 409 already voted, 400 bad option
  void req
  void findPoll
  void votePoll
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deletePoll
  return json({ error: 'not implemented' }, 501)
}
