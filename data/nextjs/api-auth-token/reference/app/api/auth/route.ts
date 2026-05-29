const VALID = { username: 'admin', password: 'secret' }

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
  const data = (body ?? {}) as { username?: unknown; password?: unknown }
  const username = data.username
  const password = data.password

  if (
    typeof username !== 'string' ||
    username.length === 0 ||
    typeof password !== 'string' ||
    password.length === 0
  ) {
    return json({ error: 'missing fields' }, 400)
  }

  if (username === VALID.username && password === VALID.password) {
    return json({ token: `token-${username}` })
  }
  return json({ error: 'invalid credentials' }, 401)
}
