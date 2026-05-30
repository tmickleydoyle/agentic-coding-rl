import { createJob, jobsWithCounts } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { jobs } each with a candidateCount
  void req
  void jobsWithCounts
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a job from { title, department? }; 400 if title blank
  void req
  void createJob
  return json({ error: 'not implemented' }, 501)
}
