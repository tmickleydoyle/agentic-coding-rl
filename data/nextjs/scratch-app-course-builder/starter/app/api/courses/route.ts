export async function GET(_req: Request): Promise<Response> { return Response.json({ course: {}, modules: [], lessons: [] }); }
export async function POST(_req: Request): Promise<Response> { return new Response('Not Implemented', { status: 501 }); }
export async function DELETE(_req: Request): Promise<Response> { return new Response('Not Implemented', { status: 501 }); }
export async function PATCH(_req: Request): Promise<Response> { return new Response('Not Implemented', { status: 501 }); }
