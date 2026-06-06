const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
}

function romanToInt(roman: string): number | null {
  if (roman.length === 0) return null
  for (let i = 0; i < roman.length; i++) {
    if (!(roman[i] in ROMAN_VALUES)) return null
  }
  let total = 0
  for (let i = 0; i < roman.length; i++) {
    const curr = ROMAN_VALUES[roman[i]]
    const next = i + 1 < roman.length ? ROMAN_VALUES[roman[i + 1]] : 0
    if (curr < next) {
      total -= curr
    } else {
      total += curr
    }
  }
  return total
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  if (!('roman' in query)) {
    return json({ error: 'roman query parameter is required' }, 400)
  }

  const roman = query['roman']
  const value = romanToInt(roman.toUpperCase())
  if (value === null) {
    return json({ error: 'invalid Roman numeral' }, 422)
  }

  return json({ roman, value })
}
