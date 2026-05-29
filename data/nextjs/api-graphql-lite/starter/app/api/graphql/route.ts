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

export async function POST(req: Request): Promise<Response> {
  // TODO: parse { query }, resolve selection, return { data } or { errors }
  void req
  void users
  return json({ errors: [{ message: 'not implemented' }] }, 501)
}
