const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

function luhn(digits: string): boolean {
  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const raw = params.get('number')
  if (raw === null || raw.trim() === '') {
    return json({ error: 'number is required' }, 400)
  }
  const stripped = raw.replace(/ /g, '')
  if (stripped === '') {
    return json({ error: 'number is required' }, 400)
  }
  if (!/^\d+$/.test(stripped)) {
    return json({ error: 'number must contain only digits' }, 400)
  }
  return json({ valid: luhn(stripped) })
}
