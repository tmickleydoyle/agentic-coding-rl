export async function GET(_req: Request): Promise<Response> {
  return Response.json({ students: [], grades: [], subjects: [] });
}

export async function POST(_req: Request): Promise<Response> {
  return new Response('Not Implemented', { status: 501 });
}

export async function DELETE(_req: Request): Promise<Response> {
  return new Response('Not Implemented', { status: 501 });
}
