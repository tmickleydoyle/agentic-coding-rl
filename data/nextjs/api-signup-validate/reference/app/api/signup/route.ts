const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const data = (body ?? {}) as { email?: unknown; password?: unknown }
  const errors: { email?: string; password?: string } = {}

  const email = data.email
  if (typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    errors.email = 'invalid email'
  }

  const password = data.password
  if (typeof password !== 'string' || password.length < 8) {
    errors.password = 'password too short'
  }

  if (Object.keys(errors).length > 0) return json({ errors }, 400)
  return json({ ok: true })
}
