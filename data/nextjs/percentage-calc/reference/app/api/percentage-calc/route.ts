const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  const { value: valueStr, total: totalStr, decimals: decimalsStr } = query

  if (valueStr === undefined || totalStr === undefined) {
    return json({ error: 'value and total are required' }, 400)
  }

  const value = Number(valueStr)
  const total = Number(totalStr)

  if (isNaN(value) || isNaN(total)) {
    return json({ error: 'value and total must be numbers' }, 400)
  }

  if (total === 0) {
    return json({ error: 'total must not be zero' }, 400)
  }

  let decimals = 2
  if (decimalsStr !== undefined) {
    const d = Number(decimalsStr)
    if (!isNaN(d)) {
      decimals = Math.max(0, Math.min(10, Math.floor(d)))
    }
  }

  const percentage = parseFloat(((value / total) * 100).toFixed(decimals))

  return json({ value, total, percentage, decimals })
}
