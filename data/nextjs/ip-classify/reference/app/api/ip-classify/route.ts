const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

function classifyIP(octets: number[]): string {
  const first = octets[0]
  if (first <= 127) return 'A'
  if (first <= 191) return 'B'
  if (first <= 223) return 'C'
  if (first <= 239) return 'D'
  return 'E'
}

function isPrivate(octets: number[]): boolean {
  const [a, b] = octets
  if (a === 10) return true
  if (a === 127) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  return false
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  const ip = query['ip']
  if (ip === undefined) {
    return json({ error: 'ip is required' }, 400)
  }

  const parts = ip.split('.')
  if (parts.length !== 4) {
    return json({ error: 'invalid IPv4 address' }, 400)
  }

  const octets: number[] = []
  for (let i = 0; i < 4; i++) {
    const n = Number(parts[i])
    if (!Number.isInteger(n) || isNaN(n) || n < 0 || n > 255 || parts[i].trim() === '') {
      return json({ error: 'invalid IPv4 address' }, 400)
    }
    octets.push(n)
  }

  return json({
    ip,
    class: classifyIP(octets),
    private: isPrivate(octets),
  })
}
