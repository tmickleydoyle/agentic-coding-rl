export async function GET(_request: Request): Promise<Response> {
  return Response.json({ data: [] });
}
export async function POST(_request: Request): Promise<Response> {
  return Response.json({ success: false }, { status: 501 });
}
export async function PATCH(_request: Request): Promise<Response> {
  return Response.json({ success: false }, { status: 501 });
}
export async function DELETE(_request: Request): Promise<Response> {
  return Response.json({ success: false }, { status: 501 });
}
