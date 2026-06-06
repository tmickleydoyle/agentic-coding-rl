export async function GET(_req: Request): Promise<Response> { return Response.json({ meetings: [] }); }
export async function POST(_req: Request): Promise<Response> { return Response.json({ error: "Not implemented" }, { status: 501 }); }
export async function PUT(_req: Request): Promise<Response> { return Response.json({ error: "Not implemented" }, { status: 501 }); }
export async function DELETE(_req: Request): Promise<Response> { return Response.json({ error: "Not implemented" }, { status: 501 }); }
