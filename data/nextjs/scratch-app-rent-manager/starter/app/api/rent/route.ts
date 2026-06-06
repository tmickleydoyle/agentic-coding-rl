export async function GET(_request: Request): Promise<Response> {
  return Response.json([]);
}

export async function POST(_request: Request): Promise<Response> {
  return Response.json({}, { status: 201 });
}

export async function DELETE(_request: Request): Promise<Response> {
  return Response.json({ success: false });
}
