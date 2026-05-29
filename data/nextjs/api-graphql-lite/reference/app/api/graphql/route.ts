interface Post {
  id: number
  title: string
}
interface User {
  id: number
  name: string
  posts: Post[]
}

const SEED: User[] = [
  { id: 1, name: 'Ada', posts: [{ id: 10, title: 'Engines' }, { id: 11, title: 'Notes' }] },
  { id: 2, name: 'Lin', posts: [{ id: 20, title: 'Graphs' }] },
]

let users: User[] = SEED.map((u) => ({ ...u, posts: u.posts.map((p) => ({ ...p })) }))

export function __reset(): void {
  users = SEED.map((u) => ({ ...u, posts: u.posts.map((p) => ({ ...p })) }))
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

class ParseError extends Error {}

interface Field {
  name: string
  selection: Field[] | null
}

// Tokenize into a flat stream we can walk. Recognizes identifiers, ( ) { } : and integers.
function tokenize(src: string): string[] {
  const tokens: string[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (c === '(' || c === ')' || c === '{' || c === '}' || c === ':') {
      tokens.push(c)
      i++
      continue
    }
    if (/[A-Za-z0-9_]/.test(c)) {
      let j = i
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++
      tokens.push(src.slice(i, j))
      i = j
      continue
    }
    throw new ParseError('unexpected character')
  }
  return tokens
}

function parseSelectionSet(tokens: string[], pos: { i: number }): Field[] {
  if (tokens[pos.i] !== '{') throw new ParseError('expected {')
  pos.i++
  const fields: Field[] = []
  while (tokens[pos.i] !== '}') {
    if (pos.i >= tokens.length) throw new ParseError('unbalanced braces')
    const name = tokens[pos.i]
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new ParseError('expected field name')
    pos.i++
    let selection: Field[] | null = null
    if (tokens[pos.i] === '{') {
      selection = parseSelectionSet(tokens, pos)
    }
    fields.push({ name, selection })
  }
  pos.i++ // consume }
  if (fields.length === 0) throw new ParseError('empty selection set')
  return fields
}

interface Parsed {
  id: number
  selection: Field[]
}

function parse(query: string): Parsed {
  const tokens = tokenize(query)
  const pos = { i: 0 }
  if (tokens[pos.i] !== 'user') throw new ParseError('expected user')
  pos.i++
  if (tokens[pos.i] !== '(') throw new ParseError('expected (')
  pos.i++
  if (tokens[pos.i] !== 'id') throw new ParseError('expected id arg')
  pos.i++
  if (tokens[pos.i] !== ':') throw new ParseError('expected :')
  pos.i++
  const idTok = tokens[pos.i]
  if (!/^\d+$/.test(idTok ?? '')) throw new ParseError('expected integer id')
  const id = Number(idTok)
  pos.i++
  if (tokens[pos.i] !== ')') throw new ParseError('expected )')
  pos.i++
  const selection = parseSelectionSet(tokens, pos)
  if (pos.i !== tokens.length) throw new ParseError('trailing tokens')
  return { id, selection }
}

const USER_SCALARS = new Set(['id', 'name'])
const POST_SCALARS = new Set(['id', 'title'])

function resolvePost(post: Post, fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const f of fields) {
    if (!POST_SCALARS.has(f.name)) throw new ParseError(`unknown field: ${f.name}`)
    if (f.selection) throw new ParseError(`field ${f.name} has no subfields`)
    out[f.name] = (post as unknown as Record<string, unknown>)[f.name]
  }
  return out
}

function resolveUser(user: User, fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const f of fields) {
    if (f.name === 'posts') {
      if (!f.selection) throw new ParseError('posts requires a selection set')
      out.posts = user.posts.map((p) => resolvePost(p, f.selection as Field[]))
    } else if (USER_SCALARS.has(f.name)) {
      if (f.selection) throw new ParseError(`field ${f.name} has no subfields`)
      out[f.name] = (user as unknown as Record<string, unknown>)[f.name]
    } else {
      throw new ParseError(`unknown field: ${f.name}`)
    }
  }
  return out
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = null
  }
  const query =
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).query
      : undefined
  if (typeof query !== 'string') {
    return json({ errors: [{ message: 'query required' }] }, 400)
  }

  let parsed: Parsed
  try {
    parsed = parse(query)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'parse error'
    return json({ errors: [{ message }] }, 400)
  }

  const user = users.find((u) => u.id === parsed.id)

  // Validate selection even when user is missing, so unknown fields still 400.
  try {
    if (!user) {
      // Validate against an empty user shape to surface unknown-field errors.
      resolveUser({ id: 0, name: '', posts: [] }, parsed.selection)
      return json({ data: { user: null } })
    }
    const data = resolveUser(user, parsed.selection)
    return json({ data: { user: data } })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'resolve error'
    return json({ errors: [{ message }] }, 400)
  }
}
