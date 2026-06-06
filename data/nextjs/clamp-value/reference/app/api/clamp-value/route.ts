const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const valueStr = params.get('value')
  const minStr = params.get('min')
  const maxStr = params.get('max')

  const value = parseFloat(valueStr ?? '')
  const min = parseFloat(minStr ?? '')
  const max = parseFloat(maxStr ?? '')

  if (valueStr === null || minStr === null || maxStr === null || isNaN(value) || isNaN(min) || isNaN(max)) {
    return json({ error: 'value, min, and max are required numbers' }, 400)
  }
  if (min > max) {
    return json({ error: 'min must be <= max' }, 400)
  }
  const result = Math.min(Math.max(value, min), max)
  return json({ result })
}
