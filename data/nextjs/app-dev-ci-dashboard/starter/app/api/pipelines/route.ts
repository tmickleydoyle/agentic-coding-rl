import { createPipeline, listPipelines } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { pipelines }
  void req
  void listPipelines
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a pipeline from { name, repo? }; 400 if name blank
  void req
  void createPipeline
  return json({ error: 'not implemented' }, 501)
}
