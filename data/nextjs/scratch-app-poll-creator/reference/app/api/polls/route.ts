import { getPolls, addPoll, getVotes, addVote } from '../../../lib/store'
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  if (url.pathname.endsWith('/votes')) return Response.json({ votes: getVotes() })
  return Response.json({ polls: getPolls() })
}
export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const body = await req.json()
  if (url.pathname.endsWith('/votes')) {
    const { pollId, option } = body
    if (!pollId || !option) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    return Response.json(addVote({ pollId, option }), { status: 201 })
  }
  const { question, options } = body
  if (!question) return new Response(JSON.stringify({ error: 'Missing question' }), { status: 400 })
  return Response.json(addPoll({ question, options: options ?? [] }), { status: 201 })
}
