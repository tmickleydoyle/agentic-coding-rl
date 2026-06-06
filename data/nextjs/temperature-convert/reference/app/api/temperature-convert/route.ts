const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const VALID_UNITS = ['celsius', 'fahrenheit', 'kelvin']

function toCelsius(value: number, from: string): number {
  if (from === 'celsius') return value
  if (from === 'fahrenheit') return (value - 32) * 5 / 9
  // kelvin
  return value - 273.15
}

function fromCelsius(celsius: number, to: string): number {
  if (to === 'celsius') return celsius
  if (to === 'fahrenheit') return (celsius * 9 / 5) + 32
  // kelvin
  return celsius + 273.15
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  if (!('value' in query) || !('from' in query) || !('to' in query)) {
    return json({ error: 'value, from, and to query parameters are required' }, 400)
  }

  const rawValue = query['value']
  const from = query['from'].toLowerCase()
  const to = query['to'].toLowerCase()

  const numValue = Number(rawValue)
  if (isNaN(numValue)) {
    return json({ error: 'value must be a valid number' }, 422)
  }

  if (!VALID_UNITS.includes(from) || !VALID_UNITS.includes(to)) {
    return json({ error: 'from and to must be celsius, fahrenheit, or kelvin' }, 422)
  }

  const celsius = toCelsius(numValue, from)
  const result = round2(fromCelsius(celsius, to))

  return json({ value: numValue, from, to, result })
}
