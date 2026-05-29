const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const slugify = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const title = ((body ?? {}) as { title?: unknown }).title
  if (typeof title !== 'string') {
    return json({ error: 'title required' }, 400)
  }
  const slug = slugify(title)
  if (slug === '') {
    return json({ error: 'title required' }, 400)
  }
  return json({ slug })
}
