const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

function fibonacci(n: number): number {
  if (n === 0) return 0
  if (n === 1) return 1
  let a = 0
  let b = 1
  for (let i = 2; i <= n; i++) {
    const temp = a + b
    a = b
    b = temp
  }
  return b
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  if (!('n' in query)) {
    return json({ error: 'n query parameter is required' }, 400)
  }

  const raw = query['n']
  const n = Number(raw)

  if (!Number.isInteger(n) || n < 0 || raw.trim() === '') {
    return json({ error: 'n must be a non-negative integer' }, 422)
  }

  return json({ n, result: fibonacci(n) })
}
