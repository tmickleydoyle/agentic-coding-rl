export async function GET(_req: Request): Promise<Response> {
  return Response.json({ student: {}, courses: [], progress: [] });
}

export async function POST(_req: Request): Promise<Response> {
  return new Response('Not Implemented', { status: 501 });
}

export async function PATCH(_req: Request): Promise<Response> {
  return new Response('Not Implemented', { status: 501 });
}
