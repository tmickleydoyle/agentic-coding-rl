export async function GET() {
  return Response.json([])
}

export async function POST(_req: Request) {
  return Response.json({ error: 'Not implemented' }, { status: 400 })
}

export async function PATCH(_req: Request) {
  return Response.json({ error: 'Not implemented' }, { status: 400 })
}
