interface User {
  id: number
  name: string
  age: number
  role: string
}

const USERS: User[] = [
  { id: 1, name: 'Alice', age: 30, role: 'admin' },
  { id: 2, name: 'Bob', age: 25, role: 'user' },
  { id: 3, name: 'Carol', age: 40, role: 'admin' },
  { id: 4, name: 'Dave', age: 19, role: 'user' },
  { id: 5, name: 'Eve', age: 35, role: 'guest' },
]

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: filter USERS by ?role and ?minAge; 400 on bad minAge
  void req
  void USERS
  return json({ error: 'not implemented' }, 501)
}
