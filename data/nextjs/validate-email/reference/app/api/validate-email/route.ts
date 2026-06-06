const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

function isValidEmail(email: string): boolean {
  if (email.includes(' ')) return false
  const atIndex = email.indexOf('@')
  if (atIndex <= 0) return false
  if (email.indexOf('@', atIndex + 1) !== -1) return false
  const domain = email.slice(atIndex + 1)
  const dotIndex = domain.lastIndexOf('.')
  if (dotIndex <= 0) return false
  if (dotIndex === domain.length - 1) return false
  return true
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  params.forEach((v, k) => { query[k] = v })

  if (!('email' in query)) {
    return json({ error: 'email query parameter is required' }, 400)
  }

  const email = query['email']
  return json({ email, valid: isValidEmail(email) })
}
