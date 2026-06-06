export async function GET(_req: Request): Promise<Response> { return Response.json({ skills: [], paths: [], progress: [] }); }
export async function PATCH(_req: Request): Promise<Response> { return new Response('Not Implemented', { status: 501 }); }
