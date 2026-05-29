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
  const params = new URL(req.url).searchParams
  const role = params.get('role')
  const minAgeRaw = params.get('minAge')

  let minAge: number | null = null
  if (minAgeRaw !== null) {
    if (!/^\d+$/.test(minAgeRaw)) {
      return json({ error: 'invalid minAge' }, 400)
    }
    minAge = Number(minAgeRaw)
  }

  let users = USERS
  if (role !== null) users = users.filter((u) => u.role === role)
  if (minAge !== null) users = users.filter((u) => u.age >= (minAge as number))

  return json({ users, count: users.length })
}
