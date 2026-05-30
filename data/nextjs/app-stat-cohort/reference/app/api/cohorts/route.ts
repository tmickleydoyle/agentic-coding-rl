import { averages, createCohort, deleteCohort, listCohorts } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

const isNumberArray4 = (v: unknown): v is number[] =>
  Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number')

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const minSizeRaw = params.get('minSize')
  const minSize =
    minSizeRaw !== null && minSizeRaw.trim() !== '' && !Number.isNaN(Number(minSizeRaw))
      ? Number(minSizeRaw)
      : null
  const cohorts = listCohorts({ minSize })
  if (params.get('averages') === '1') {
    return json({ averages: averages(cohorts) })
  }
  return json({ cohorts })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const month = body.month
  if (typeof month !== 'string' || month.trim().length === 0) {
    return json({ error: 'month required' }, 400)
  }
  if (typeof body.size !== 'number') {
    return json({ error: 'size required' }, 400)
  }
  let retention: number[] | undefined
  if (body.retention !== undefined) {
    if (!isNumberArray4(body.retention)) {
      return json({ error: 'retention must have 4 values' }, 400)
    }
    retention = body.retention
  }
  const cohort = createCohort({ month: month.trim(), size: body.size, retention })
  return json(cohort, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteCohort(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
